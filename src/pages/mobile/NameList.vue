<template>
  <MobilePage
    fill="neutral"
    class="name-list"
  >
    <NameListHeader />

    <h2>
      {{ view === VIEW_ENDING_SOONEST ? $t('name.list.ending-soonest-note') : '' }}
      {{ view === VIEW_CHARACTER_LENGTH ? $t('name.list.character-length-note') : '' }}
      {{ view === VIEW_MAX_BID ? $t('name.list.max-bid-note') : '' }}
    </h2>

    <div
      v-if="view === VIEW_CHARACTER_LENGTH"
      class="length-selector"
    >
      <ButtonFlat
        v-for="l in times(9, idx => idx + 5)"
        :key="l"
        :to="{ name: 'name-list-character-length', params: { length: l } }"
      >
        {{ l }}
      </ButtonFlat>
    </div>

    <AeLoader v-if="array === null" />
    <h2 v-else-if="array.length === 0">
      {{ $t('name.list.no-auctions') }}
    </h2>
    <template v-else>
      <AeCard fill="maximum">
        <ListItemAccount
          v-for="item in array"
          :key="item.name"
          :name="item.name"
          :address="item.winning_bidder"
          :subtitle="VIEW_MAX_BID === view ? item.max_bid
            : $tc('name.expiration', item.expiration - topBlockHeight)"
          subtitle-proportional
        />
      </AeCard>

      <div
        v-if="pagination.length > 1"
        class="pagination"
      >
        <Component
          :is="p.to ? 'RouterLink' : 'span'"
          v-for="p in pagination"
          :key="p.text"
          :to="p.to"
        >
          <ArrowDouble
            v-if="['first', 'last'].includes(p.text)"
            :class="p.text"
          />
          <template v-else>
            {{ p.text }}
          </template>
        </Component>
      </div>
    </template>

    <ButtonAddFixed :to="{ name: 'name-new' }" />
  </MobilePage>
</template>

<script>
import { pick, times } from 'lodash-es';
import BigNumber from 'bignumber.js';
import { MAGNITUDE } from '../../lib/constants';
import { fetchJson } from '../../store/utils';
import MobilePage from '../../components/mobile/Page.vue';
import NameListHeader from '../../components/mobile/NameListHeader.vue';
import ButtonFlat from '../../components/mobile/ButtonFlat.vue';
import AeLoader from '../../components/AeLoader.vue';
import AeCard from '../../components/AeCard.vue';
import ListItemAccount from '../../components/ListItemAccount.vue';
import { ArrowDouble } from '../../components/icons';
import ButtonAddFixed from '../../components/ButtonAddFixed.vue';

const ITEMS_PER_PAGE = 5;
const VIEW_ENDING_SOONEST = 'ending-soonest';
const VIEW_CHARACTER_LENGTH = 'character-length';
const VIEW_MAX_BID = 'max-bid';

export default {
  components: {
    MobilePage,
    NameListHeader,
    ButtonFlat,
    AeLoader,
    AeCard,
    ListItemAccount,
    ArrowDouble,
    ButtonAddFixed,
  },
  props: {
    view: { type: String, required: true },
    page: { type: Number, default: 1 },
    length: { type: Number, default: 6 },
  },
  data: () => ({
    VIEW_ENDING_SOONEST,
    VIEW_CHARACTER_LENGTH,
    VIEW_MAX_BID,
    array: null,
    pageCount: 0,
  }),
  computed: {
    pagination() {
      const res = [];
      const { page: p, pageCount: pc } = this;
      if (p > 3) res.push({ text: 'first', to: 1 });
      if (p > 2) res.push({ text: p - 2, to: p - 2 });
      if (p > 1) res.push({ text: p - 1, to: p - 1 });
      res.push({ text: this.page });
      if (p < pc) res.push({ text: p + 1, to: p + 1 });
      if (p < pc - 1) res.push({ text: p + 2, to: p + 2 });
      if (p < pc - 2) res.push({ text: 'last', to: pc });
      return res.map(i => ({
        ...i,
        to: i.to && ({
          name: this.$route.name,
          params: { ...this.$route.params, page: i.to },
        }),
      }));
    },
  },
  subscriptions() {
    return pick(this.$store.state.observables, ['topBlockHeight']);
  },
  async mounted() {
    this.$watch(
      ({ view, page, length }) => ({ view, page, length }),
      ({ view, page, length }) => this.fetchAuctions({
        page,
        ...{
          [VIEW_ENDING_SOONEST]: { sort: 'expiration' },
          [VIEW_CHARACTER_LENGTH]: { length },
          [VIEW_MAX_BID]: { sort: 'max_bid' },
        }[view] || (() => { throw new Error('Invalid view'); })(),
      }),
      { immediate: true },
    );
  },
  methods: {
    times,
    async fetchAuctions(params) {
      if (this.array) this.array.map(item => item.subscription.unsubscribe());
      this.array = null;
      const applyParams = (paramNames, url) => paramNames
        .filter(paramName => params[paramName])
        .forEach(paramName => url.searchParams.set(paramName, params[paramName]));

      const arrayUrl = new URL(
        `${this.$store.getters.currentNetwork.middlewareUrl}/middleware/names/auctions/active`,
      );
      applyParams(['length'], arrayUrl);
      const countUrl = new URL(arrayUrl);
      countUrl.pathname += '/count';
      applyParams(['page', 'sort'], arrayUrl);
      arrayUrl.searchParams.set('limit', String(ITEMS_PER_PAGE));

      const [array, { count }] = await Promise.all([fetchJson(arrayUrl), fetchJson(countUrl)]);
      this.array = array.map((auction) => {
        const { max_bid, ...other } = auction; // eslint-disable-line camelcase
        other.subscription = this.$store.state.observables
          .convertAmount(() => BigNumber(max_bid).shiftedBy(-MAGNITUDE))
          .subscribe((value) => { other.max_bid = value; });
        return other;
      });
      this.pageCount = Math.ceil(count / ITEMS_PER_PAGE);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../styles/variables/colors.scss';
@import '../../styles/placeholders/typography.scss';

.name-list {
  .length-selector {
    overflow-x: auto;
    margin-bottom: rem(30px);
    white-space: nowrap;
  }

  .pagination {
    margin-top: rem(16px);
    @extend %face-sans-s;
    text-align: center;

    span, a {
      padding: 0 rem(2px);
    }

    a {
      text-decoration: none;
      color: $color-neutral;

      .icon {
        height: rem(7px);

        &.first {
          transform: rotate(180deg);
        }
      }
    }
  }
}
</style>
