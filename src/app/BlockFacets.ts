import { BlockTypes } from '../base/Constants';
import { Facet } from '../base/Facet';

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

export interface IsPressedFacettProps {
  isPressed: boolean;
}

export class IsPressedFacet extends Facet<IsPressedFacettProps> {
  constructor(props: IsPressedFacettProps) {
    super(props);
  }
}

export interface IsEditingFacetProps {
  isEditing: boolean;
}

export class IsEditingFacet extends Facet<IsEditingFacetProps> {
  constructor(props: IsEditingFacetProps) {
    super(props);
  }
}

export interface IsSelectedFacetProps {
  isSelected: boolean;
}

export class IsSelectedFacet extends Facet<IsSelectedFacetProps> {
  constructor(props: IsSelectedFacetProps) {
    super(props);
  }
}

export interface IdFacetProps {
  id: string;
}

export class IdFacet extends Facet<IdFacetProps> {
  constructor(props: IdFacetProps) {
    super(props);
  }
}

export interface IsFocusedFacetProps {
  isFocused: boolean;
}

export class IsFocusedFacet extends Facet<IsFocusedFacetProps> {
  constructor(props: IsFocusedFacetProps) {
    super(props);
  }
}
