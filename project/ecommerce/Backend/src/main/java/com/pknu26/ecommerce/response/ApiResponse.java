package com.pknu26.ecommerce.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
 
    private final boolean success;
    private final String message;
    private final T data;
 
    private ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
 
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, "SUCCESS", data);
    }
 
    public static <T> ApiResponse<T> ok(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }
 
    public static <T> ApiResponse<T> created(T data) {
        return new ApiResponse<>(true, "CREATED", data);
    }
 
    public static ApiResponse<Void> noContent() {
        return new ApiResponse<>(true, "NO_CONTENT", null);
    }
 
    public static ApiResponse<Void> error(String message) {
        return new ApiResponse<>(false, message, null);
    }

    public static <T> ApiResponse<T> error(String message, T data) {
    return new ApiResponse<>(false, message, data);
}
}