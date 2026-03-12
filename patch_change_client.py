import re

with open("frontend/src/pages/ChangeClientLocation.tsx", "r") as f:
    content = f.read()

content = content.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect, useMemo } from 'react';")
content = re.sub(r"  const \[filteredClients, setFilteredClients\] = useState<Client\[\]>\(\[\]\);\n", "", content)

use_effect_code = """  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClients(clients);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredClients(
        clients.filter(
          (client) =>
            client.name.toLowerCase().includes(query) ||
            client.city.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, clients]);"""

use_memo_code = """  const filteredClients = useMemo(() => {
    if (searchQuery.trim() === '') {
      return clients;
    }
    const query = searchQuery.toLowerCase();
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        client.city.toLowerCase().includes(query)
    );
  }, [searchQuery, clients]);"""

content = content.replace(use_effect_code, use_memo_code)
content = content.replace("      setFilteredClients(data);\n", "")

with open("frontend/src/pages/ChangeClientLocation.tsx", "w") as f:
    f.write(content)
