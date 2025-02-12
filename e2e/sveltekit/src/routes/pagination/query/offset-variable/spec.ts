import { expect, test } from '@playwright/test';
import { routes } from '../../../../lib/utils/routes.js';
import { expect_1_gql, expectToBe, goto } from '../../../../lib/utils/testsHelper.js';

test.describe('offset paginatedQuery', () => {
  test('loadNextPage', async ({ page }) => {
    await goto(page, routes.Pagination_query_offset_variable);

    await expectToBe(page, 'Bruce Willis, Samuel Jackson');

    // wait for the api response
    await expect_1_gql(page, 'button[id=next]');

    // make sure we got the new content
    await expectToBe(page, 'Bruce Willis, Samuel Jackson, Morgan Freeman, Tom Hanks');
  });

  test('refetch', async ({ page }) => {
    await goto(page, routes.Pagination_query_offset_variable);

    // wait for the api response
    await expect_1_gql(page, 'button[id=next]');

    // wait for the api response
    const response = await expect_1_gql(page, 'button[id=refetch]');
    expect(response).toBe(
      '{"data":{"usersList":[{"name":"Bruce Willis","id":"pagination-query-offset-variables:1"},{"name":"Samuel Jackson","id":"pagination-query-offset-variables:2"},{"name":"Morgan Freeman","id":"pagination-query-offset-variables:3"},{"name":"Tom Hanks","id":"pagination-query-offset-variables:4"}]}}'
    );
  });
});
