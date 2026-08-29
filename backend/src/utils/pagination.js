// Pagination Normalizer Utility

function parsePagination(query = {}) {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 20;
  if (limit > 100) limit = 100; // Enforce maximum page size limit

  const skip = (page - 1) * limit;
  const sort = query.sort || '-createdAt';

  return {
    page,
    limit,
    skip,
    sort
  };
}

module.exports = {
  parsePagination
};
