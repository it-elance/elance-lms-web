'use client';

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  favouriteApi,
  getFavouriteLecturesApi,
  getFavouriteMaterialsApi,
} from '@/services/api.service';
import type { FavouritePayload } from '@/types/favourite.types';
import type { LectureVideoData } from '@/types/lecture.types';
import type { Material } from '@/types/material.types';

interface ToggleFavouritePayload extends FavouritePayload {
  lectureId?: string | null;
}

const getLectureVideoKey = (lectureId: string) =>
  ['lecture-video', lectureId] as const;

const getLectureMaterialsKey = (lectureId: string) =>
  ['lecture-materials', lectureId] as const;

export const useFavourite = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      lectureId: _lectureId,
      ...payload
    }: ToggleFavouritePayload) => favouriteApi(payload),

    onMutate: async (variables) => {
      const lectureVideoKey = getLectureVideoKey(variables.entity_id);

      const materialsKey = variables.lectureId
        ? getLectureMaterialsKey(variables.lectureId)
        : undefined;

      const previousVideo =
        queryClient.getQueryData<LectureVideoData>(lectureVideoKey);

      const previousMaterials = materialsKey
        ? queryClient.getQueryData<Material[]>(materialsKey)
        : undefined;

      if (variables.entity_type === 'lecture') {
        queryClient.setQueryData<LectureVideoData>(lectureVideoKey, (old) =>
          old
            ? {
                ...old,
                is_favourite: variables.is_favourite,
              }
            : old
        );
      }

      if (variables.entity_type === 'material' && materialsKey) {
        queryClient.setQueryData<Material[]>(materialsKey, (old = []) =>
          old.map((material) =>
            material.material_id === variables.entity_id
              ? {
                  ...material,
                  is_favourite: variables.is_favourite,
                }
              : material
          )
        );
      }

      return {
        previousVideo,
        previousMaterials,
        materialsKey,
      };
    },

    onError: (_error, variables, context) => {
      if (variables.entity_type === 'lecture') {
        queryClient.setQueryData(
          getLectureVideoKey(variables.entity_id),
          context?.previousVideo
        );
      }

      if (context?.materialsKey) {
        queryClient.setQueryData(
          context.materialsKey,
          context.previousMaterials
        );
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favourite-lectures'] });
      queryClient.invalidateQueries({ queryKey: ['favourite-materials'] });
    },
  });

  return {
    toggleFavourite: mutation.mutate,
    isTogglingFavourite: mutation.isPending,
  };
};

export const useFavouriteLectures = (
  params: {
    chapterId?: string;
    paperId?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  },
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['favourite-lectures', params],
    queryFn: () => getFavouriteLecturesApi(params),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};

export const useFavouriteMaterials = (
  params: {
    chapterId?: string;
    paperId?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  },
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['favourite-materials', params],
    queryFn: () => getFavouriteMaterialsApi(params),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
