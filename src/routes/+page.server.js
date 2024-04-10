import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } from "$env/static/private";
import Airtable from "airtable";
import { error } from "@sveltejs/kit";

export async function load() {
  const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

  const data = [];

  try {
    const airtablePromise = base(AIRTABLE_TABLE_NAME)
      .select({
        view: "View for mapping",
      })
      .eachPage(function page(records, fetchNextPage) {
        // page() called for each page of records

        records.forEach(function (record) {
          data.push(record.fields);
        });

         fetchNextPage();
      });

    await airtablePromise;
  } catch (err) {
    throw error(
      err.statusCode,
      `Something went wrong trying to fetch the data. ${err.error}: ${err.message}`
    );
  }

  return {
    airtableRecords: data,
  };
}