import VariablesExtractor, { IVariableStrategy } from '../variables-extractor';
import { DocumentLine, LineExtraction, flattenLineExtractionsFlatten } from '../../util/color-util';
import Variable, { VariableLocation } from '../variable';
import Color from '../../colors/color';
import VariablesStore from '../variable-store';
import ColorExtractor from '../../colors/color-extractor';
import { EOL } from '../../util/regexp';

export const REGEXP = new RegExp(`(^|(?::|=)\\s*)((?:[\\-]*[$a-z_][\\-_\\d]*)+)(?!=)${EOL}`, 'gi');
export const DECLARATION_REGEXP = new RegExp(`(?:(^(?:\\$|(?:[\\-_$]+[a-z\\d]+)|(?:[^\\d||\\-|@]+))(?:[_a-zd][\\-]*)*))\\s*=${EOL}`, 'gi');
// export const DECLARATION_REGEXP = new RegExp(`(?:((?:\\$|(?:[\\-_$]+[a-z\\d]+)|(?:[^\\d||\\-|@]+))(?:[_a-zd][\\-]*)*))\\s*=${REGEXP_END}`, 'gi');
// export const DECLARATION_REGEXP = new RegExp(`(?:((?:(?:\\$)|(?:[\\-_$]+[a-z\\d]+)|(?:[^\\d]+))([\\-_a-z\d]*))\\s*)=${REGEXP_END}`, 'gi');

class StylusExtractor implements IVariableStrategy {
  name: string = 'STYLUS';
  private store: VariablesStore = new VariablesStore();

  public async extractDeclarations(fileName: string, fileLines: DocumentLine[]): Promise<number> {
    return fileLines.map(({text, line}) => this.__extractDeclarations(fileName, text, line)).length;
  }
  public __extractDeclarations(fileName: string, text: string, line: number) {
    let match = null;
    while ((match = DECLARATION_REGEXP.exec(text)) !== null) {
      const varName = (match[1] || match[2]).trim();
      if (varName === '') {
        continue;
      }
      let color = ColorExtractor.extractOneColor(text.slice(match.index + match[0].length).trim()) || this.extractVariable(fileName, text.slice(match.index + match[0].length).trim());
      if (this.store.has(varName, fileName, line)) {
        const decoration = this.store.findDeclaration(varName, fileName, line);
        decoration.update(<Color>color);
      } else {
        const variable = new Variable(varName, <Color> color, {fileName, line, position: match.index}, this.name);
        this.store.addEntry(varName, variable); // update entry??
      }
    }
  }

  public getVariableValue(variable: Variable): Color | null {
    if (this.store.has(variable.name) === false) {
      return null;
    }
    let decoration = this.store.findClosestDeclaration(variable.name, variable.location.fileName);
    if (decoration.color === undefined) {
      decoration = this.store.findClosestDeclaration(variable.name, '.');
    }
    let color = null;

    if (decoration.color) {
      color = new Color(variable.color.value, variable.location.position, decoration.color.rgb, decoration.color.alpha);
    }
    return color;
  }

  extractVariables(fileName: string, fileLines: DocumentLine[]): Promise<LineExtraction[]> {
    const variables = fileLines.map(({line, text}) => {
      let match = null;
      let colors: Variable[] = [];
      while ((match = REGEXP.exec(text)) !== null) {
        let varName =  match[2];
        varName = varName.trim();
        if (varName === '') { // can be '' ?
          continue;
        }
        let spaces = (match[1] || '').length;

        const location: VariableLocation = { fileName, line, position: match.index };
        let variable = new Variable(varName, new Color(varName, spaces + match.index, null, null), location, this.name);
        colors.push(variable);
      }
      return {line, colors};
    });
    return flattenLineExtractionsFlatten(variables);
  }

  extractVariable(fileName: string, text: string): Color | undefined {
    let match: RegExpExecArray = REGEXP.exec(text); // not working with match ><
    let variable;
    if (match) {
      variable = this.store.findClosestDeclaration(match[2].trim(), fileName);
    }
    return variable ? variable.color : undefined;
  }
  variablesCount(): number {
    return this.store.count;
  }
  deleteVariable(fileName: string, line: number) {
    return this.store.delete(null, fileName, line);
  }
}


VariablesExtractor.registerStrategy(new StylusExtractor());
export default StylusExtractor;
