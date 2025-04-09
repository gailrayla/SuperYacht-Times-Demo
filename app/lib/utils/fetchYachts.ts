export const fetchYachts = async (searchTerm: string, token: string) => {
  const res = await fetch(
    "https://www.superyachttimes.com/api/v2/yacht_likes/search",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        size: 25,
        from: 0,
        query: {
          bool: {
            should: [
              {
                multi_match: {
                  query: searchTerm,
                  fields: ["name^3", "previous_names^2"],
                  type: "best_fields",
                  fuzziness: "AUTO",
                },
              },
            ],
          },
        },
      }),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("API error:", errorText);
    throw new Error(`Failed to fetch with status:  + ${res.status}`);
  }

  return res.json();
};
