import type { CatalogLink } from "../types";
import { CatalogLinkCreate } from "./CatalogLinkCreate";
import { CatalogLinkEdit } from "./CatalogLinkEdit";
import { CatalogLinkList } from "./CatalogLinkList";
import { CatalogLinkShow } from "./CatalogLinkShow";

export default {
  list: CatalogLinkList,
  create: CatalogLinkCreate,
  edit: CatalogLinkEdit,
  show: CatalogLinkShow,
  recordRepresentation: (record: CatalogLink) => record.title,
};
