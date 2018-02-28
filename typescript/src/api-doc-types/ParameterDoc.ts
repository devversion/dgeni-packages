import { Declaration, ParameterDeclaration, Symbol, SymbolFlags } from 'typescript';
import { getDeclarationTypeText, getInitializer } from '../services/TsParser/getDeclarationTypeText';
import { getTypeText } from '../services/TsParser/getTypeText';
import { nodeToString } from '../services/TsParser/nodeToString';
import { BaseApiDoc } from './ApiDoc';
import { ParameterContainer } from './ParameterContainer';

/**
 * This represents a call parameter of an exported function or of a method of a class or interface.
 * You can find them on the `FunctionExportDoc.parameters` or `MethodMemberDoc.parameters` properties.
 * They are generated by the call to `getParameters` service.
 */
export class ParameterDoc extends BaseApiDoc {
  docType = 'parameter';
  type = getDeclarationTypeText(this.declaration, this.namespacesToInclude);
  isOptional = !!(this.declaration.questionToken);
  isRestParam = !!(this.declaration.dotDotDotToken);
  defaultValue = this.declaration.initializer && nodeToString(this.declaration.initializer);
  paramText = this.getParamText();
  description = this.content;

  constructor(public container: ParameterContainer,
              public symbol: Symbol,
              public declaration: ParameterDeclaration) {
    super(container.moduleDoc, symbol, declaration);

    this.id = `${this.container.id}~${this.name}`;
    this.aliases = (this.container.aliases || []).map(alias => `${alias}~${this.name}`);
  }

  getParamText() {
    let paramText = '';
    if (this.isRestParam) paramText += '...';
    paramText += this.name;
    if (this.isOptional) paramText += '?';
    if (this.type) paramText += ': ' + this.type;
    if (this.defaultValue) paramText += ' = ' + this.defaultValue;
    return paramText.trim();
  }
}