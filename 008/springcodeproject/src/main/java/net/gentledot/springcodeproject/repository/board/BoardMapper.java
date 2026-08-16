package net.gentledot.springcodeproject.repository.board;

import java.util.Optional;

import org.apache.ibatis.annotations.*;

import net.gentledot.springcodeproject.model.board.Board;

@Mapper
public interface BoardMapper {
    @Insert(value = "INSERT INTO tbl_board (title, content, writer) " + 
            "VALUES (#{title}, #{content}, #{writer})")
    @Options(useGeneratedKeys = true, keyProperty = "bno")
    Integer create(Board board);

    @Select("SELECT bno, title, content, writer, regdate, viewcnt " + 
            "FROM tbl_board " + 
            "WHERE bno = #{bno}")
    Optional<Board> findByBno(Long boardNo);

    @Update("UPDATE tbl_board " + 
            "SET " + 
            "    title = #{title}, content = #{content} " + 
            "WHERE bno = #{bno}")
    Integer update(Board board);

    @Delete("DELETE FROM tbl_board " +
            "WHERE bno = #{bno}")
    Integer delete(Long boardNo);

}
