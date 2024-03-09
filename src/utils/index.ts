import _ from "lodash";

/**
 * @description Get specific field in object
 * @param param0
 * @returns
 */
export const getIntoData = ({
  fields,
  objects,
  unSelect = false,
}: {
  fields: string[];
  objects: {};
  unSelect?: boolean;
}) => {
  if (unSelect) {
    return _.omit(objects, fields);
  }
  return _.pick(objects, fields);
};

// /**
//  * @description Create VALUES $ for Query Command
//  * @param paramsNumber
//  * @param valueNumber
//  * @returns
//  */
// export const getQueryParams = (paramsNumber: number, valueNumber: number) => {
//   const ret = [];
//   for (let i = 0; i < paramsNumber; i++) {
//     const params = (index: number) => {
//       const values = [];
//       for (let j = 1; j <= valueNumber; j++) {
//         values.push(`$${index * valueNumber + j}`);
//       }
//       return `(${values.join(",")})`;
//     };

//     ret.push(`${params(i)}`);
//   }
//   return ret.join(",");
// };

export const getQueryParams = (params: string[], numberOfRecord = 1) => {
  let columnList: string[] = [];
  let valueList: string[] = [];
  let i = 1;

  params.forEach((item) => {
    columnList.push(item);
  });

  while (numberOfRecord) {
    let tmp: string[] = [];
    params.forEach((item) => {
      tmp.push(`$${i}`);
      i += 1;
    });
    valueList.push(`(${tmp.join(",")})`);
    numberOfRecord -= 1;
  }

  return {
    columnList: `(${columnList.join(",")})`,
    valueList: `${valueList.join(",")}`,
  };
};

export const checkNullField = (payload: any): boolean => {
  for (var key in payload) {
    if (typeof payload[key] === "object" && payload[key] != null) {
      let nestedObject = checkNullField(payload[key]);
      if (!nestedObject) {
        return false;
      }
    } else if (payload[key] == null) {
      return false;
    }
  }
  return true;
};
