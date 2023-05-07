# Libraries
library(tidyverse)
library(rvest)
library(networkD3)
library(qdapRegex)
library(tidygraph)
library(jsonlite)

name_of_output_file <- "src/R/outputs/sample_graph_api4.html"  

df <- read.csv("src/R/material/sample-syllabus-extracted-concepts.csv")

# transform into tidy form (one concept per row)
tidy <- df %>% 
  separate_rows(extracted_concepts, sep = ",")

# count the occurrences of the concepts
concepts_count <- tidy %>% 
  count(extracted_concepts) %>% 
  arrange(-n)

# combinations of the concepts extracted
wikipedia <- tidy %>% 
  pull(extracted_concepts) %>% 
  expand_grid(item1 = ., item2 = .) %>% 
  filter(item1 != item2) %>% 
  mutate(edge = 0)

# iterate over each couple of concepts
for(i in 1:nrow(wikipedia))
{
  item1 = wikipedia$item1[i]
  url = paste("https://en.wikipedia.org/wiki/", gsub(" ", "_", item1), sep = "")
  if (i == 1)
  {
    result <- tryCatch({
      wikitext <- read_html(url)
    }, error = function(e) {
      message("Error occurred:", e)
      NULL
    })
    
  }
  else
  {
    if (item1 != wikipedia$item1[i-1])
    {
      result <- tryCatch({
        wikitext <- read_html(url)
      }, error = function(e) {
        message("Error occurred:", e)
        NULL
      })
      
    }
  }
  # check if result is NULL
  if(!is.null(result)) 
  {
    hyper_urls <- wikitext %>%
      html_nodes("  p > a , .navigation-not-searchable a") %>% 
      html_attr("href") %>% 
      rm_url()
    hyper_urls <- hyper_urls[grep("\\S", hyper_urls)]
    hyper_urls <- hyper_urls %>% 
      str_remove("/wiki/") 
    keyword <- hyper_urls %>%
      str_to_lower() %>% 
      as_tibble() %>% 
      #replace "_"
      mutate(value = str_replace_all(value, "\\_", " ")) %>% 
      mutate(value = str_replace(value, " \\(.+\\)", "")) %>% 
      unique()
    if (wikipedia$item2[i] %in% keyword$value == TRUE)
    {
      wikipedia$edge[i] = 1
    }
  }
  
}

wiki_graph <- wikipedia %>% 
  filter(edge == 1) %>% 
  as_tbl_graph(directed = F) %>% 
  activate(nodes) %>% 
  mutate(degree = tidygraph::centrality_degree(mode = "all")) %>%
  left_join(concepts_count %>% select(name = extracted_concepts, n)) %>%
  #filter(degree > 1) %>%
  #top_n(30, degree) %>% 
  arrange(desc(degree)) %>% 
  filter(row_number() <= 50) %>% 
  mutate(comp = tidygraph::group_components()) %>% 
  filter(comp == 1)

json_nodes = wiki_graph %>% 
  as_tibble() %>% 
  select(-comp) %>% 
  rename(size=n) %>% 
  mutate(node_id = row_number())

json_edges = wiki_graph %>% 
  activate(edges) %>% 
  as_tibble() 

net <- igraph_to_networkD3(wiki_graph)

network_out <- forceNetwork(Links =net$links %>% mutate(value = "1"), Nodes = net$nodes %>% 
                              mutate(group = "1") %>% 
                              left_join(concepts_count %>% select(name = extracted_concepts, n)),
                            Source = "source", Target = "target",
                            NodeID = "name", Group = "group", Nodesize = "n", Value = "value",
                            opacity = 0.8, zoom = T, arrows = T)


saveNetwork(network_out,name_of_output_file, selfcontained = TRUE)

print("success")