import _ from "lodash";

/**
 * @description Get specific field in object
 * @param param0
 * @returns
 */
export const getIntoData = ({
  fields,
  objects,
}: {
  fields: string[];
  objects: {};
}) => {
  return _.pick(objects, fields);
};

/**
 * @description Create VALUES $ for Query Command
 * @param paramsNumber
 * @param valueNumber
 * @returns
 */
export const getQueryParams = (paramsNumber: number, valueNumber: number) => {
  const ret = [];
  for (let i = 0; i < paramsNumber; i++) {
    const params = (index: number) => {
      const values = [];
      for (let j = 1; j <= valueNumber; j++) {
        values.push(`$${index * valueNumber + j}`);
      }
      return `(${values.join(",")})`;
    };

    ret.push(`${params(i)}`);
  }
  return ret.join(",");
};
