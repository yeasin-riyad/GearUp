import path from "path";
import YAML from "yamljs";

const swaggerDocument = YAML.load(
  path.join(process.cwd(), "src/docs/openapi.yaml")
);

export default swaggerDocument;