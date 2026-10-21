
/* responsibility */

// Parses unified resource query parameters
// from an incoming H3 request event.


/* filter */

function guessFilterValue(value: any) {
  if (value === 'true') {
    return true;
  }
  else if (value === 'false') {
    return false;
  }
  else if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:e[+-]?\d+)?$/i.test(value) && Number.isFinite(Number(value))) {
    return Number(value);
  }
  else {
    return value;
  }
}

function escapeRegularExpression(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


export function extractFilterFromEvent(event: H3Event): Record<string, any> | undefined {

  const filter = getQuery(event)?.filter ?? '';

  if (!filter) {
    return undefined;
  }


  return String(filter).split(',').map(it => it.split(':')).reduce((acc, it) => {

    const key = it[0] as string;
    const hasOperator = it.length >= 3;
    const operator = hasOperator ? it[1] : 'is';
    const rawValue = hasOperator ? it.slice(2).join(':') : it[1] as string;
    const value = guessFilterValue(rawValue);


    if (operator === 'is') {
      acc[key] = value;
    }
    else if (operator === 'eq') {
      acc[key] = {
        $eq: value,
      };
    }
    else if (operator === 'ne') {
      acc[key] = {
        $ne: value,
      };
    }
    else if (operator === 'gt') {
      acc[key] = {
        $gt: value,
      };
    }
    else if (operator === 'gte') {
      acc[key] = {
        $gte: value,
      };
    }
    else if (operator === 'lt') {
      acc[key] = {
        $lt: value,
      };
    }
    else if (operator === 'lte') {
      acc[key] = {
        $lte: value,
      };
    }
    else if (operator === 'in') {
      acc[key] = {
        $in: String(rawValue).split(';').map(it => guessFilterValue(it)),
      };
    }
    else if (operator === 'nin') {
      acc[key] = {
        $nin: String(rawValue).split(';').map(it => guessFilterValue(it)),
      };
    }
    else if (operator === 'like') {
      acc[key] = {
        $regex: escapeRegularExpression(String(rawValue)),
        $options: 'i',
      };
    }
    else if (operator === 'contains') {
      acc[key] = {
        $regex: escapeRegularExpression(String(value)),
        $options: 'i',
      };
    }
    else if (operator === 'on') {
      acc[key] = {
        $gte: Number(value),
        $lt: Number(value) + 24 * 60 * 60 * 1000,
      };
    }
    else if (operator === 'before') {
      acc[key] = {
        $lt: Number(value),
      };
    }
    else if (operator === 'after') {
      acc[key] = {
        $gte: Number(value) + 24 * 60 * 60 * 1000,
      };
    }
    else if (operator === 'empty') {
      acc[key] = {
        $size: 0,
      };
    }
    else if (operator === 'not-empty') {
      acc[key] = {
        $exists: true,
        $not: {
          $size: 0,
        },
      };
    }
    else if (operator === 'empty-object') {
      acc[key] = {
        $eq: {},
      };
    }
    else if (operator === 'not-empty-object') {
      acc[key] = {
        $ne: {},
      };
    }
    else if (operator === 'exists') {
      acc[key] = {
        $exists: true,
      };
    }
    else if (operator === 'not-exists') {
      acc[key] = {
        $exists: false,
      };
    }
    else if (operator === 'null') {
      acc[key] = {
        $eq: null,
      };
    }
    else if (operator === 'not-null') {
      acc[key] = {
        $exists: true,
        $ne: null,
      };
    }

    return acc;

  }, {} as Record<string, any>);

}


/* select */

export function extractSelectFromEvent(event: H3Event): string[] | undefined {

  const select = getQuery(event)?.select;

  if (!select) {
    return undefined;
  }


  return String(select).split(',').map(it => it.trim()).filter(it => Boolean(it));

}


/* sort */

export function extractSortFromEvent(event: H3Event): Record<string, 1 | -1> | undefined {

  const sort = getQuery(event)?.sort ?? '';

  if (!sort) {
    return undefined;
  }


  return String(sort).split(',').map(it => it.split(':')).reduce((acc, it) => {

    const key = it[0] as string;
    const direction = it[1] === 'asc' ? 1 : -1;

    acc[key] = direction;

    return acc;

  }, {} as Record<string, 1 | -1>);

}


/* populate */

export function extractPopulateFromEvent(event: H3Event): Record<string, string[]> | undefined {

  const populate = getQuery(event)?.populate;

  if (!populate) {
    return undefined;
  }


  return Object.fromEntries(String(populate).split(',').map(it => it.split(':')).map(it => [
    it[0],
    (it[1] || '').split(';'),
  ]));

}
