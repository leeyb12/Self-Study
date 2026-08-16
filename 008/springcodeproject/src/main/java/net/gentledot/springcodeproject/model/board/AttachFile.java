package net.gentledot.springcodeproject.model.board;

/**
 * 게시글에 첨부된 파일 정보를 담는 모델 클래스입니다.
 */
public class AttachFile {
    /** 파일을 구분하기 위한 고유 식별자입니다. */
    private String uuid;

    /** 첨부파일이 연결된 게시글 번호입니다. */
    private long bno;

    /** 파일이 업로드된 서버 경로입니다. */
    private String uploadPath;

    /** 원본 파일 이름입니다. */
    private String fileName;

    /** 파일 종류 또는 확장자 정보를 저장합니다. */
    private String fileType;

    /**
     * 기본 생성자입니다.
     */
    public AttachFile() {

    }

    public String getUuid() {
        return uuid;
    }

    public long getBno() {
        return bno;
    }

    public String getuploadPath() {
        return uploadPath;
    }

    public String getFileName() {
        return fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public void setBno(long bno) {
        this.bno = bno;
    }

    public void setUploadPath(String uploadPath) {
        this.uploadPath = uploadPath;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    /**
     * 첨부파일 객체의 주요 값을 문자열로 확인할 때 사용합니다.
     */
    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("AttachFile{");
        sb.append("uuid='").append(uuid).append('\'');
        sb.append(", bno=").append(bno);
        sb.append(", uploadPath='").append(uploadPath).append('\'');
        sb.append(", fileName='").append(fileName).append('\'');
        sb.append(", fileType='").append(fileType).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
