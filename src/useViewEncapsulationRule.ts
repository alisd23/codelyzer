import { getComponentDecorator, getDecoratorPropertyInitializer } from './util/utils';
import { ComponentMetadata } from './angular/metadata';
import * as Lint from 'tslint';
import * as ts from 'typescript';

import { NgWalker } from './angular/ngWalker';

export class Rule extends Lint.Rules.AbstractRule {

  static metadata: Lint.IRuleMetadata = {
    ruleName: 'use-view-encapsulation',
    type: 'maintainability',
    description: 'Disallows using of ViewEncapsulation.None',
    rationale: '',
    options: null,
    optionsDescription: 'Not configurable',
    typescriptOnly: true
  };

  static FAILURE = 'Using "ViewEncapsulation.None" may cause conflicts between css rules having the same selector';

  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    const walker = new ViewEncapsulationWalker(sourceFile, this.getOptions());
    return this.applyWithWalker(walker);
  }
}

class ViewEncapsulationWalker extends NgWalker {

  visitClassDeclaration(node: ts.ClassDeclaration) {
    const d = getComponentDecorator(node);
    const encapsulation = getDecoratorPropertyInitializer(d, 'encapsulation');

    if(encapsulation.name.text !== 'None') { return; }

    this.addFailure(
      this.createFailure(
        encapsulation.getStart(),
        encapsulation.getWidth(),
        Rule.FAILURE
      )
    );
  }
}
