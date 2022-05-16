<script>
import { defineComponent, reactive} from "vue";

import MessageService from '@/service/MessageService';

export default defineComponent({
  props: {
    fessUrl: {
      type: String,
      default: '',
    },
    contentTitle: {
      type: String,
      default: '',
    },
    docId: {
      type: String,
      default: '',
    },
    queryId: {
      type: String,
      default: '',
    },
    urlLink: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: -1,
    },
    contentDescription: {
      type: String,
      default: '',
    },
    contentLength: {
      type: Number,
      default: -1,
    },
    sitePath: {
      type: String,
      default: '',
    },
    created: {
      type: String,
      default: '',
    },
    lastModified: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: '',
    },
    enableThumbnail: {
      type: Boolean,
      default: true,
    },
    linkTarget: {
      type: String,
      default: '',
    }
  },

  setup(props, context) {
    // reactive data
    const state = reactive({
      existThumbnail: false,
      message: new MessageService(props.language),
    });

    // method definitions
    const formatDate = (dateStr) => {
      let formatted = dateStr;
      formatted = formatted.replace('T', ' ');
      formatted = formatted.substring(0, formatted.indexOf(':', formatted.indexOf(':') + 1));
      return formatted;
    };
    
    const formatContentLength = (contentLength) => {
      if (contentLength < 1000) {
        return contentLength;
      }

      let formatted = contentLength / 1000;
      formatted = Math.floor(formatted * 10) / 10;
      if (formatted < 1000) {
        return formatted + 'K';
      }

      formatted = contentLength / 1000;
      formatted = Math.floor(formatted * 10) / 10;
      if (formatted < 1000) {
        return formatted + 'M';
      }

      formatted = contentLength / 1000;
      formatted = Math.floor(formatted * 10) / 10;
      if (formatted < 1000) {
        return formatted + 'G';
      }

      formatted = contentLength / 1000;
      formatted = Math.floor(formatted * 10) / 10;
      return formatted + 'T';
    };

    const hasThumbnail = (element) => {
      state.existThumbnail = true;
    };

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
      <a
        class="link"
        :href="urlLink"
        :data-uri="urlLink" 
        :data-id="docId"
        :data-order="order"
        :target="linkTarget"
      >
        {{ contentTitle }}
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
      <div v-html="contentDescription" class="description" />
    </div>
    <div class="site text-truncate">
      <cite>{{ sitePath }}</cite>
    </div>
    <div class="info">
      <small>
        <span v-if="created !== ''">
          {{ state.message.get('result.created') }}: {{ formatDate(created) }}
        </span>
        <span v-if="lastModified !== ''">
          {{ state.message.get('result.order.last_modified') }}: {{ formatDate(lastModified) }}
        </span>
        <span v-if="contentLength > -1">
          - {{ formatContentLength(contentLength) }} {{ state.message.get('result.size') }}
        </span>
      </small>
    </div>
  </div>
</template>