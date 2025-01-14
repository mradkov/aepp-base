<template>
  <MobilePage
    class="apps"
    fill="neutral"
  >
    <Guide :template="$t('app.list.browse-guide')" />

    <UrlForm @input="searchTerm = $event" />

    <Guide :template="$t('app.list.featured-guide')" />

    <AeCard fill="maximum">
      <ListItem
        v-for="(app, idx) in aeternityApps"
        :key="`list-item-aeternity-app-${idx}`"
        :to="`/browser/${app.path}`"
        :title="app.name"
        :subtitle="app.path"
      >
        <img
          v-if="app.icon"
          slot="icon"
          :src="app.icon"
          :alt="app.name"
        >
      </ListItem>
    </AeCard>

    <template v-if="bookmarkedApps.length">
      <Guide :template="$t('app.list.bookmarked-guide')" />

      <div class="shortcuts">
        <AppShortcut
          v-for="(app, idx) in bookmarkedAppsToShow"
          :key="`app-shortcut-aeternity-app-${idx}`"
          v-bind="app"
          :to="`/browser/${app.host}`"
        />
      </div>
    </template>
  </MobilePage>
</template>

<script>
import Fuse from 'fuse.js';
import { mapState } from 'vuex';
import { aeternityAppsPaths } from '../../lib/appsRegistry';
import MobilePage from '../../components/mobile/Page.vue';
import Guide from '../../components/Guide.vue';
import UrlForm from '../../components/mobile/UrlForm.vue';
import AppShortcut from '../../components/AppShortcut.vue';
import AeCard from '../../components/AeCard.vue';
import ListItem from '../../components/ListItem.vue';

export default {
  components: {
    MobilePage,
    Guide,
    UrlForm,
    AppShortcut,
    AeCard,
    ListItem,
  },
  data: () => ({ searchTerm: '' }),
  computed: {
    ...mapState({
      aeternityApps: (state, getters) => aeternityAppsPaths
        .map(path => ({ ...getters['appsMetadata/get'](path), path })),
      bookmarkedApps: ({ apps }, getters) => apps
        .filter(({ bookmarked }) => bookmarked)
        .map(app => ({ ...app, ...getters['appsMetadata/get'](app.host) })),
    }),
    fuse() {
      return new Fuse(this.bookmarkedApps, {
        tokenize: true,
        matchAllTokens: true,
        keys: ['name', 'host'],
      });
    },
    bookmarkedAppsToShow() {
      return this.searchTerm ? this.fuse.search(this.searchTerm) : this.bookmarkedApps;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../styles/functions';

.apps {
  .url-form {
    margin: rem(24px) rem(-16px);
    border-radius: rem(4px);
    background-color: $color-neutral-positive-3;
  }

  .shortcuts {
    margin: rem(20px) rem(-10px);
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    grid-gap: 30px 10px;
    justify-items: center;
  }

  .ae-card {
    margin-bottom: rem(24px);
  }
}
</style>
