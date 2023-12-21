import _ from "lodash";

const getIntoData = ({
  fields,
  objects,
}: {
  fields: string[];
  objects: {};
}) => {
  return _.pick(objects, fields);
};

export default getIntoData;
