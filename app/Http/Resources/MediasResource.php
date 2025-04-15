<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MediasResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'ref_id' => $this->ref_id,
            'url' => $this->url,
            'path' => $this->path,
            'filename' => $this->filename,
            'field' => $this->field,
            'sortable' => $this->sortable,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
