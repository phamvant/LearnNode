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
    params: Object.keys(toSnake(params))
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

const transformJson = <T extends Record<string, any>>(
  object: T,
  transformFn: (key: string) => string
): T => {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [transformFn(key), value])
  ) as T;
};

export const toCamel = <T extends Record<string, any>>(
  payload: T[] | T
): T[] | T => {
  if (!payload) {
    return payload;
  }

  if (Array.isArray(payload)) {
    return payload.map((field) => transformJson(field, camelCase) as T);
  }

  return transformJson(payload, camelCase);
};

export const toSnake = <T extends Record<string, any>>(
  payload: T[] | T
): T[] | T => {
  if (!payload) {
    return payload;
  }

  if (Array.isArray(payload)) {
    return payload.map((field) => transformJson(field, snakeCase) as T);
  }

  return transformJson(payload, snakeCase);
};
