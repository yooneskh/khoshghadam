<script setup>

/* interface */

const props = defineProps({
  items: Array,
  multiple: Boolean,
  onSelected: Function,
});

const emit = defineEmits([
  'close',
]);


/* media */

const itemsPerPage = ref(12);
const currentPage = ref(1);

const currentItems = ref(radCloneDeep(props.items || []));
const currentItemsTitles = ref({});

const openedMedia = ref();
const isViewerOpen = ref(false);


const { data: mediaData, pending: isMediaPending, refresh: refreshMedia } = useUFetch(
  '/api/media',
  {
    query: {
      'sort': '_id:-1',
      'skip': computed(() => (currentPage.value - 1) * itemsPerPage.value),
      'limit': itemsPerPage,
    },
  },
);

const { data: mediaCountData, refresh: refreshMediaCount } = useUFetch(
  '/api/media/count',
);


watchImmediate(currentItems, async () => {
  await Promise.all(
    currentItems.value.map(async it => {

      if (currentItemsTitles.value[it]) {
        return;
      }


      const resource = await ufetch(`/api/media/${it}`);

      currentItemsTitles.value[it] = resource.name || truncateMiddle(resource._id);

    }),
  );
});


async function handleUploadMedia() {
  await launchFormPickerDialog({
    icon: 'lucide:cloud-upload',
    title: 'Upload Media',
    subtitle: 'Select new files to upload as media',
    fields: [
      {
        key: 'files',
        identifier: 'input',
        label: 'Files',
        type: 'file',
        multiple: true,
      },
    ],
    submitButton: {
      icon: 'lucide:cloud-upload',
      label: 'Upload Files',
      onClick: async form => {

        for (const file of form.files) {

          const body = new FormData();
          body.append('file', file);

          await ufetch('/api/media/upload', {
            method: 'post',
            body,
          });

        }


        await Promise.all([
          refreshMedia(),
          refreshMediaCount(),
        ]);

        toastSuccess({
          title: 'Media uploaded successfully.',
        });

      },
    },
  });
}

async function handleDeleteMedia(media) {
  await launchChoicePickerDialog({
    icon: 'lucide:trash',
    title: 'Delete Media',
    subtitle: `Deleting ${media.name}`,
    text: 'Are you sure you want to delete this media? This action cannot be undone.',
    startButtons: [
      {
        color: 'error',
        icon: 'lucide:trash',
        label: 'Delete Media',
        onClick: async () => {

          await ufetch(`/api/media/${media._id}`, {
            method: 'delete',
          });


          await Promise.all([
            refreshMedia(),
            refreshMediaCount(),
          ]);

          toastSuccess({
            title: 'Media successfully deleted.',
          });

        },
      },
    ],
  });
}

async function handleSelectMedia(media) {
  if (!props.multiple) {
    await handleSubmitSelection([media._id]);
  }
  else {
    currentItems.value = radToggle(currentItems.value, media._id);
  }
}

async function handleSubmitSelection(items) {
  await props.onSelected?.(items);
  emit('close', items);
}

</script>


<template>
  <u-modal scrollable :ui="{ content: 'max-w-5xl' }" @update:open="!$event && emit('close')">
    <template #content>
      <un-card
        icon="lucide:file-badge"
        title="Select Media"
        :subtitle="props.multiple ? 'Select one or more media' : 'Select one media'"
        fluid-body
        :append-actions="[
          {
            icon: 'lucide:plus',
            label: 'Upload New',
            onClick: handleUploadMedia,
          },
        ]"
        :actions="[
          ...(!props.multiple ? [] : [{
            icon: 'lucide:check',
            label: 'Submit Selection',
            onClick: () => handleSubmitSelection(currentItems),
          }]),
          {
            actionType: 'spacer',
          },
          {
            variant: 'ghost',
            label: $t('common.cancel'),
            onClick: () => emit('close'),
          },
        ]">

        <template v-if="props.multiple">
          <div class="flex flex-wrap items-center gap-2 border-b border-default p-3">
            <template v-for="(item, index) of currentItems" :key="item">
              <u-badge
                variant="subtle"
                :label="currentItemsTitles[item] || '-'"
                trailing-icon="lucide:x">
                <template #trailing>
                  <u-icon
                    name="lucide:x"
                    @click="currentItems.splice(index, 1)"
                  />
                </template>
              </u-badge>
            </template>
          </div>
        </template>

        <template v-if="!mediaData?.length && isMediaPending">
          <div class="h-32 flex items-center justify-center">
            <un-spinner />
          </div>
        </template>

        <template v-else-if="!mediaData?.length">
          <p class="h-32 flex items-center justify-center text-sm text-center">
            No media has been uploaded yet.
          </p>
        </template>

        <template v-else>

          <div class="grid grid-cols-2 tablet:grid-cols-4 desktop:grid-cols-6 gap-3 p-3">
            <template v-for="media of mediaData" :key="media._id">
              <div class="p-1 space-y-1 relative group transition cursor-pointer hover:bg-muted" @click="handleSelectMedia(media)">

                <template v-if="media.type?.startsWith('image')">
                  <img
                    :src="media.variants?.thumb || media.path"
                    class="w-full h-32 object-contain object-center"
                  />
                </template>
                <template v-else>
                  <div class="w-full h-32 flex items-center justify-center">
                    <u-icon
                      name="lucide:file"
                      class="size-8"
                    />
                  </div>
                </template>

                <div class="text-xs">
                  {{ media.name }}
                </div>

                <div class="text-xs">
                  {{ media.type }} - {{ (media.size / 1024 / 1024).toFixed(2) }} MB
                </div>

                <template v-if="currentItems.includes(media._id)">
                  <div class="absolute top-1 inset-s-1">
                    <u-badge
                      color="success"
                      icon="lucide:check"
                    />
                  </div>
                </template>

                <div class="absolute top-1 inset-e-1 flex items-center gap-1" @click.stop>
                  <u-dropdown-menu
                    :items="[
                      {
                        icon: 'lucide:eye',
                        label: 'View Full Size',
                        onSelect: () => { openedMedia = media; isViewerOpen = true; },
                      },
                      {
                        color: 'error',
                        icon: 'lucide:trash',
                        label: 'Delete Media',
                        onSelect: () => handleDeleteMedia(media),
                      },
                    ]"
                    :ui="{
                      content: 'min-w-64',
                    }">
                    <u-button
                      size="xs"
                      icon="lucide:ellipsis-vertical"
                    />
                  </u-dropdown-menu>
                </div>

              </div>
            </template>
          </div>

          <div class="flex items-center gap-2 p-3 border-t border-default">
            <u-pagination
              active-color="neutral"
              :total="mediaCountData"
              :items-per-page="itemsPerPage"
              v-model:page="currentPage"
            />
            <div class="grow" />
            <u-select
              :items="[6, 12, 24]"
              v-model="itemsPerPage"
            />
            <span class="text-sm">
              Items per page
            </span>
          </div>

        </template>

        <u-modal scrollable :ui="{ content: openedMedia?.type?.startsWith('image') ? '' : 'max-w-5xl' }" v-model:open="isViewerOpen">
          <template #content>

            <template v-if="openedMedia.type?.startsWith('image')">
              <img
                :src="openedMedia.path"
              />
            </template>

            <template v-else>
              <object
                :type="openedMedia.type"
                :data="openedMedia.path"
                class="w-full! h-128"
              />
            </template>

          </template>
        </u-modal>

      </un-card>
    </template>
  </u-modal>
</template>
