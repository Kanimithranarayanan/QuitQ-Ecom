package com.quitq.utility;

import com.quitq.exception.FileInvalidExtensionException;
import com.quitq.exception.FileNotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public class FileUtility {

    public static void validateFile(MultipartFile file) {
        if (file.isEmpty())
            throw new FileNotFoundException("Please select file to upload");

        List<String> allowedExts = List.of("png", "jpeg", "jpg", "webp");

        // Extract the extension of uploaded file
        String filename = file.getOriginalFilename(); // product.jpeg
        String ext = filename.split("\\.")[1];

        if (!allowedExts.contains(ext))
            throw new FileInvalidExtensionException(ext + " not allowed");
    }
}
