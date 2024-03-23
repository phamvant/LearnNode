import _, { camelCase, snakeCase } from "lodash";

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

export const getUpdateQueryParams = (params: Record<string, any>) => {
  return {
    params: Object.keys(params)
      .reduce((previousValue, currentValue, currentIndex) => {
        previousValue.push(`"${currentValue}"=$${currentIndex + 1}`);
        return previousValue;
      }, [] as string[])
      .join(","),
    length: Object.keys(params).length,
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

export const toCamel = (
  payload: Record<string, any>[]
): Record<string, any>[] => {
  if (!payload) {
    return payload;
  }

  return payload.map((field: Record<string, any>) =>
    Object.fromEntries(
      Object.entries(field).map(([key, value]) => [camelCase(key), value])
    )
  );
};

export const toSnake = (
  payload: Record<string, any>[]
): Record<string, any>[] => {
  if (!payload) {
    return payload;
  }

  return payload.map((field: Record<string, any>) =>
    Object.fromEntries(
      Object.entries(field).map(([key, value]) => [snakeCase(key), value])
    )
  );
};
