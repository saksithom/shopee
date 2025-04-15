<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class MediasCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return $this->collection->map(function (MediasResource $resource) {
            return [
                'id' => $resource->id,
                'ref_id' => $resource->ref_id,
                'url' => $resource->url,
                'path' => $resource->path,
                'filename' => $resource->filename,
                'field' => $resource->field,
                'sortable' => $resource->sortable,
                'created_at' => $resource->created_at,
                'updated_at' => $resource->updated_at
            ];
        });
    }
}
