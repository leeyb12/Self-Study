package net.gentledot.springcodeproject.model.board;

import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.builder.ToStringBuilder;

/**
 * 게시글 목록 조회에 사용할 페이지 번호와 페이지당 게시글 수를 관리하는 클래스입니다.
 */
public class PageCriteria {
    /** 현재 페이지 번호입니다. */
    private long page;

    /** 한 페이지에 보여줄 게시글 수입니다. */
    private long perPageNum;

    /**
     * 페이지 조건을 생성하며 기본값과 허용 범위를 적용합니다.
     */
    public PageCriteria(Long page, Long perPageNum) {
        page = ObjectUtils.defaultIfNull(page, 1L);
        perPageNum = ObjectUtils.defaultIfNull(perPageNum, 10L);

        this.page = Math.max(page, 1);
        this.perPageNum = perPageNum < 10 || perPageNum > 100 ? 10 : perPageNum;
    }

    public long getPage() {
        return page;
    }

    public long getPerPageNum() {
        return perPageNum;
    }

    /**
     * 데이터베이스 목록 조회에서 사용할 시작 위치를 계산합니다.
     */
    public long getPageStart() {
        return (page - 1) * perPageNum;
    }

    /**
     * 페이지 조건 객체의 주요 값을 문자열로 확인할 때 사용합니다.
     */
    @Override 
    public String toString() {
        return new ToStringBuilder(this) 
                .append("page", page)
                .append("perPageNum", perPageNum)
                .toString();
    }
}
