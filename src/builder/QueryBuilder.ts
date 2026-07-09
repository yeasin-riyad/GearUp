class QueryBuilder<TWhere = Record<string, any>> {
  private where: Record<string, any> = {};
  private orderBy: Record<string, "asc" | "desc"> = {};
  private select?: Record<string, true>;

  private page = 1;
  private limit = 10;
  private skip = 0;

  constructor(private readonly query: Record<string, unknown>) {}

  /**
   * Search
   */
  search(searchableFields: string[]) {
    const searchTerm = this.query.searchTerm as string;

    if (!searchTerm) {
      return this;
    }

    this.where.OR = searchableFields.map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: "insensitive",
      },
    }));

    return this;
  }
  

  /**
   * Exact Filtering
   */
filter(filterableFields: string[]) {
  const filters: Record<string, any> = {};

  Object.keys(this.query).forEach((key) => {
    if (!filterableFields.includes(key)) {
      return;
    }

    const value = this.query[key];

    // Skip empty values
    if (value === undefined || value === null || value === "") {
      return;
    }

    /**
     * Range Filter
     *
     * pricePerDay[gte]=100
     * pricePerDay[lte]=500
     */
    if (
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      const operators: Record<string, any> = {};

      Object.entries(value as Record<string, unknown>).forEach(
        ([operator, operatorValue]) => {
          switch (operator) {
            case "gte":
              operators.gte = Number(operatorValue);
              break;

            case "gt":
              operators.gt = Number(operatorValue);
              break;

            case "lte":
              operators.lte = Number(operatorValue);
              break;

            case "lt":
              operators.lt = Number(operatorValue);
              break;
          }
        }
      );

      filters[key] = operators;

      return;
    }

    /**
     * Boolean Parser
     */
    if (value === "true") {
      filters[key] = true;
      return;
    }

    if (value === "false") {
      filters[key] = false;
      return;
    }

    /**
     * Number Parser
     */
    if (!isNaN(Number(value))) {
      filters[key] = Number(value);
      return;
    }

    /**
     * Default
     */
    filters[key] = value;
  });

  Object.assign(this.where, filters);

  return this;
}

  /**
   * Sorting
   */
  sort(allowedFields: string[], defaultField = "createdAt") {
    let sortBy = (this.query.sortBy as string) || defaultField;

    const sortOrder =
      (this.query.sortOrder as "asc" | "desc") || "desc";

    if (!allowedFields.includes(sortBy)) {
      sortBy = defaultField;
    }

    this.orderBy = {
      [sortBy]: sortOrder,
    };

    return this;
  }

  /**
   * Pagination
   */
  paginate(defaultLimit = 10, maxLimit = 100) {
    const page = Number(this.query.page);

    const limit = Number(this.query.limit);

    this.page = !isNaN(page) && page > 0 ? page : 1;

    this.limit =
      !isNaN(limit) && limit > 0
        ? Math.min(limit, maxLimit)
        : defaultLimit;

    this.skip = (this.page - 1) * this.limit;

    return this;
  }

  /**
   * Field Selection
   */
  fields(allowedFields?: string[]) {
    const fields = this.query.fields as string;

    if (!fields) {
      return this;
    }

    const select: Record<string, true> = {};

    fields
      .split(",")
      .map((field) => field.trim())
      .forEach((field) => {
        if (!allowedFields || allowedFields.includes(field)) {
          select[field] = true;
        }
      });

    if (Object.keys(select).length) {
      this.select = select;
    }

    return this;
  }

  /**
   * Prisma Query Options
   */
  build() {
    return {
      where: this.where as TWhere,
      orderBy: this.orderBy,
      skip: this.skip,
      take: this.limit,
      ...(this.select && {
        select: this.select,
      }),
    };
  }

  /**
   * Pagination Meta
   */
  getMeta(total: number) {
    return {
      page: this.page,
      limit: this.limit,
      total,
      totalPage: Math.ceil(total / this.limit),
      hasNext: this.page < Math.ceil(total / this.limit),
      hasPrev: this.page > 1,
    };
  }
}

export default QueryBuilder;