<script>
import { defineComponent, reactive} from "vue";

import MessageService from '@/service/MessageService';

/**
 * Component for search result items.
 */
export default defineComponent({
  props: {
    // Url of fess.
    fessUrl: {
      type: String,
      default: '',
    },
    // Title.
    contentTitle: {
      type: String,
      default: '',
    },
    // DocId.
    docId: {
      type: String,
      default: '',
    },
    // QueryId.
    queryId: {
      type: String,
      default: '',
    },
    // Url for link.
    urlLink: {
      type: String,
      default: '',
    },
    // Order of search condition.
    order: {
      type: Number,
      default: -1,
    },
    // Description.
    contentDescription: {
      type: String,
      default: '',
    },
    // Content length.
    contentLength: {
      type: Number,
      default: -1,
    },
    // SitePath.
    sitePath: {
      type: String,
      default: '',
    },
    // Created date.
    created: {
      type: Date,
      default: null,
    },
    // Last modified date.
    lastModified: {
      type: Date,
      default: null,
    },
    // Language for search.
    language: {
      type: String,
      default: '',
    },
    // Enable thumbnail display.
    enableThumbnail: {
      type: Boolean,
      default: true,
    },
    // Target of link.
    linkTarget: {
      type: String,
      default: '',
    },
    // Enable details.
    enableDetails: {
      type: Boolean,
      default: true,
    },
  },

  setup(props, context) {
    // reactive data
    const state = reactive({
      existThumbnail: false,
      message: new MessageService(props.language),
    });

    // method definitions

    /**
     * Format date string.
     */
    const formatDate = (date) => {
      if (date == null) {
        return '';
      }
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      return year + '-' + month.toString().padStart(2, '0') 
        + '-' + day.toString().padStart(2, '0') + ' ' 
        + hours.toString().padStart(2, '0') + ':'
        + minutes.toString().padStart(2, '0') + ':'
        + seconds.toString().padStart(2, '0');
    };
    
    // Format content length string.
    const formatContentLength = (contentLength) => {
      const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      let l = 0, n = parseInt(contentLength, 10) || 0;

      while(n >= 1024 && ++l) {
        n = n/1024;
      }

      //include a decimal point and a tenths-place digit if presenting 
      //less than ten of KB or greater units
      return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
    };

    // Set the presence of a thumbnail.
    const hasThumbnail = (element) => {
      state.existThumbnail = true;
    };

    // Set the absence of a thumbnail.
    const noThumbnail = (element) => {
      state.existThumbnail = false;
    };

    return {
      state,
      formatDate,
      formatContentLength,
      hasThumbnail,
      noThumbnail,
    };
  }
});
</script>

<template>
  <div>
    <h3 class="title text-truncate">
      <a v-html="contentTitle"
        class="link"
        :href="urlLink"
        :data-uri="urlLink" 
        :data-id="docId"
        :data-order="order"
        :target="linkTarget"
      >
      </a>
    </h3>
    <div class="body">
      <div v-if="enableThumbnail" v-show="state.existThumbnail" class="mr-3">
        <a
          class="link d-none d-sm-flex"
          :href="urlLink"
          :data-uri="urlLink"
          :data-id="docId"
          :data-order="order"
          :target="linkTarget"
        >
          <img
            :src="`${fessUrl}/thumbnail/?docId=${docId}&queryId=${queryId}`"
            alt="thumbnail"
            class="thumbnail"
            @load="hasThumbnail"
            @error="noThumbnail"
          >
        </a>
      </div>
      <div class="description" v-html="contentDescription" />
    </div>
    <div class="site text-truncate">
      <cite>{{ sitePath }}</cite>
    </div>
    <div v-if="enableDetails" class="info">
      <small>
        <span v-if="created !== ''">
          {{ state.message.get('result.created') }} {{ formatDate(created) }}&nbsp;
        </span>
        <span v-if="lastModified !== ''">
          {{ state.message.get('result.order.last_modified') }} {{ formatDate(lastModified) }}&nbsp;
        </span>
        <span v-if="contentLength > -1">
          - {{ formatContentLength(contentLength) }} {{ state.message.get('result.size') }}&nbsp;
        </span>
      </small>
    </div>
  </div>
</template>