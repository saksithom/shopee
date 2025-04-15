<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class UsersCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return $this->collection->map(function (UsersResource $resource) {
            return [
                'id' => $resource->id,
                'name' => $resource->name, 
                'email' => $resource->email,
                'level' => $resource->level,
                'active' => $resource->active,
                'creator' => new UsersResource($resource->whenLoaded('creator')),
                'updater' => new UsersResource($resource->whenLoaded('updater')),
                'created_at' => $resource->created_at,
                'updated_at' => $resource->updated_at
            ];
        });
    }
}
