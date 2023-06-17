FROM node:17.8

WORKDIR /backend

RUN apt-get update && \
    apt-get install sqlite3 curl -y

ADD . .

RUN npm install

# Download materials to generate db
RUN curl https://download1486.mediafire.com/56wjns8o59kgrZowdfe0DOsVKv8sZrbVoCqLg2LAK79eFyYHXls8rYQjb9j-MQcbu4s08ZXkhsGj8mU-cH88zw04U6rx6KLNrwZxWEpF2ctcK7sVyJzK-YlxJNnV545ZjkVGNEoXF2UrRJTqkuSajv__UfPyHr5YYv77_qXBfd8h/7m9iccm6thwbmpb/concepts_lexicon.csv --output src/conceptGraph/material/concepts_lexicon.csv && \
    curl https://download1518.mediafire.com/cqsgljyi4qngpukzL-KForHTftOXvgkDXPnKIvcXqHFVpa6LgVKEA6sxeBrB4ebV3lW2bguqv2Z_oFifSWORjxDdjWM0v6nF6Eg8YtlhOA6WsNuwqL1kRWT-ztLSjchyiLJ79K3utGB4S0-I_XibS0dn-id8DolRr5TtJ9Glsi_L/4wo2ar6eyjvrwkr/encore_oers.csv --output src/conceptGraph/material/encore_oers.csv && \
    curl https://download1515.mediafire.com/egtdogk4hqogevgtYyS9MekSWpxrNOWhEI3t7hsqLNjEezDE_76g6R4htT5bb6C63Xg56E73giQxUJAtbYyOM4vANEK5JiZ5cL7dY_VFvropRamq2_Vfms01FMa3ANXWCZBB9DCW366O2Cy_BqxncfW9FXNjfEsfNyaUpi9BCqRO/95cklraxffph8m8/OER_and_concept_table.csv --output src/conceptGraph/material/OER_and_concept_table.csv && \
    curl https://download1647.mediafire.com/i2y0iyp2jvtgevlThNeknzU4-B_SLrOftB7CurroKl35k46lATSUohxrCcSJRsjbMCui-JPCiS82NS0DWsqJFlk8A7G4vbxLNuRjiuRyGvpUtRbLPanDSCEYS_kKH1y8R2GVdutY4CyAljAi1YcfjYMaG5Dra-uq6MwF2ZWKrb1A/2b472d43bfrf47j/OER_and_wiki_relationships_hyperlinks_NEW.csv --output src/conceptGraph/material/OER_and_wiki_relationships_hyperlinks_NEW.csv


RUN npm run encore:dbInit

CMD [ "npm", "run", "start" ]
