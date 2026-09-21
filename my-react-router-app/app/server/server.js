const database = "3it_hnizdilo23";
const username = "hnizdilo23";
const password = "1vJX9Jq2Nh";
const server = "localhost";

/**
 * Execute an SQL query through the remote database gateway.
 * @param {string} sqlQuery
 */
export async function sql(sqlQuery) {
  const url = "http://marcincin.epsilon.spstrutnov.cz/gate.php";
  const postJson = JSON.stringify({
    database,
    username,
    password,
    server,
    sql: sqlQuery,
  });

  try {
    const response = await fetch(url, { method: "POST", body: postJson });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    if (Array.isArray(json)) {
      return json;
    }

    if (
      json &&
      typeof json.message === "string" &&
      json.message.toLowerCase().includes("0 results")
    ) {
      return [];
    }

    return json;
  } catch (error) {
    console.error(error.message);
    return [];
  }
}

/**
 * Escapes single quotes for SQL string literals.
 * @param {string} value
 */
export function escapeSql(value) {
  return String(value ?? "").replace(/'/g, "''");
}
