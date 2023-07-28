import { BlockTypes } from "../base/Constants";
import { Facet } from "../base/Facet";

export interface TextProps {
  text: string;
}

export class TextFacet extends Facet<TextProps> {
  constructor(props: TextProps) {
    super(props);
  }
}


export interface ChildProps {
  childOf: string;
}

export class ChildFacet extends Facet<ChildProps> {
  constructor(props: ChildProps) {
    super(props);
  }
}


export interface TypeFacetProps {
  type: BlockTypes;
}

export class TypeFacet extends Facet<TypeFacetProps> {
  constructor(props: TypeFacetProps) {
    super(props);
  }
}
