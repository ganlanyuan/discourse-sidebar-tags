import { withPluginApi } from "discourse/lib/plugin-api";
import { ajax } from "discourse/lib/ajax";

const container = Discourse.__container__;

function alphaId(a, b) {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
}

function tagCount(a, b) {
  if (a.count > b.count) {
    return -1;
  }
  if (a.count < b.count) {
    return 1;
  }
  return 0;
}

export default {
  setupComponent(attrs, component) {
    // component.set("hideSidebar", true);
    // document.querySelector(".topic-list").classList.add("with-sidebar");

    withPluginApi("0.11", (api) => {
      api.onPageChange((url) => {
        // let tagRegex = /^\/tag[s]?\/(.*)/;
        if (settings.enable_tag_cloud) {
          if (url === "/" || url === homeRoute ){
            document.querySelector("html").classList.add("tags-home");
            if (this.isDestroyed || this.isDestroying) { return; }

            component.set("isDiscoveryList", true);

            ajax("/tags.json").then(function (result) {
              let tagsAll = result.tags;
              let foundTags;
              if (settings.sort_by_popularity) {
                foundTags = tagsAll.sort(tagCount);
              } else {
                foundTags = tagsAll.sort(alphaId);
              }

              if (
                !(
                  component.get("isDestroyed") ||
                  component.get("isDestroying")
                )
              ) {
                component.set("tagList", foundTags.slice(0, settings.number_of_tags));
              }
            });
          } else {
            document.querySelector("html").classList.remove("tags-home");
            component.set("isDiscoveryList", false);
          }
        }

      });
    });
  },
};
