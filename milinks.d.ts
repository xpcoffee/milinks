/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type LinkOrGroup = Link | LinkGroup | LinkGroupRef;

/**
 * A schema to validate MiLinks configuration
 */
export interface MiLinksSchema {
  type: "group";
  /**
   * A descriptive name of the link group
   */
  name: string;
  items: LinkOrGroup[];
}
/**
 * A web link
 */
export interface Link {
  type: "link";
  url: string;
  title: string;
  description?: string;
}
/**
 * A group of web link
 */
export interface LinkGroup {
  type: "group";
  /**
   * A descriptive name of the link group
   */
  name: string;
  items: LinkOrGroup[];
}
/**
 * A link group reference, either to a local or remote group
 */
export interface LinkGroupRef {
  type: "groupRef";
  /**
   * A URL to the link group. Accepts file:// URLs for local group references.
   */
  url: string;
  /**
   * A descriptive name to override the link group's original name.
   */
  alias?: string;
  [k: string]: unknown;
}
