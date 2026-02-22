<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'category_id' => ['required', 'integer'],
            'slug' => ['required', 'string'],
            'title' => ['required', 'string'],
            'body' => ['required', 'string'],
        ];

        if ($this->isMethod('POST')) {
            $rules['thumbnail'] = 'required|image|mimes:png,jpg,jpeg|max:2048';
        } elseif ($this->isMethod('PUT')) {
            $rules['thumbnail'] = 'sometimes|image|mimes:png,jpg,jpeg|max:2048';
        }

        return $rules;
    }
}
