import { BlockTypes } from '../base/Constants';
import { Facet } from '../base/Facet';


export interface IsSmallBlockProps {
  isSmall: boolean;
}

export class IsSmallBlockFacet extends Facet<IsSmallBlockProps> {
  constructor(props: IsSmallBlockProps = { isSmall: false }) {
    super(props);
  }
}

export interface NeighbourIdProps {
  neighbourId: string;
}

export class NeighbourIdFacet extends Facet<NeighbourIdProps> {
  constructor(props: NeighbourIdProps = { neighbourId: "" }) {
    super(props);
  }
}


export interface DescriptionProps {
  description: string;
}

export class DescriptionFacet extends Facet<DescriptionProps> {
  constructor(props: DescriptionProps = { description: '' }) {
    super(props);
  }
}

export interface TextProps {
  text: string;
}

export class TextFacet extends Facet<TextProps> {
  constructor(props: TextProps = { text: '' }) {
    super(props);
  }
}

export interface ChildProps {
  childOf: string;
}

export class ChildFacet extends Facet<ChildProps> {
  constructor(props: ChildProps = { childOf: '' }) {
    super(props);
  }
}

export interface TypeFacetProps {
  type: BlockTypes;
}

export class TypeFacet extends Facet<TypeFacetProps> {
  constructor(props: TypeFacetProps = { type: BlockTypes.TEXT }) {
    super(props);
  }
}

export interface IsPressedFacetProps {
  isPressed: boolean;
}

export class IsPressedFacet extends Facet<IsPressedFacetProps> {
  constructor(props: IsPressedFacetProps = { isPressed: false }) {
    super(props);
  }
}

export interface IsEditingFacetProps {
  isEditing: boolean;
}

export class IsEditingFacet extends Facet<IsEditingFacetProps> {
  constructor(props: IsEditingFacetProps = { isEditing: false }) {
    super(props);
  }
}

export interface IsSelectedFacetProps {
  isSelected: boolean;
}

export class IsSelectedFacet extends Facet<IsSelectedFacetProps> {
  constructor(props: IsSelectedFacetProps = { isSelected: false }) {
    super(props);
  }
}

export interface IdFacetProps {
  id: string;
}

export class IdFacet extends Facet<IdFacetProps> {
  constructor(props: IdFacetProps = { id: '' }) {
    super(props);
  }
}

export interface IsFocusedFacetProps {
  isFocused: boolean;
}

export class IsFocusedFacet extends Facet<IsFocusedFacetProps> {
  constructor(props: IsFocusedFacetProps = { isFocused: false }) {
    super(props);
  }
}
