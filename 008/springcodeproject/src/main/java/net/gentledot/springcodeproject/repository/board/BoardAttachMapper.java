package net.gentledot.springcodeproject.repository.board;

import java.util.List;

import org.apache.ibatis.annotations.*;

import net.gentledot.springcodeproject.model.board.AttachFile;

@Mapper
public interface BoardAttachMapper {
    @Insert("insert into tbl_attach (uuid, bno, uploadPath, filename, filetype)\n" +
            "values (#{uuid}, #{bno}, #{uploadPath}, #{fileName}, #{fileType}")
    Integer insert(AttachFile attachFile);

    @Delete("delete from tbl_attach where uuid = #{uuid}")
    Integer delete(String uuid);

    @Select("select uuid, bno, uploadPath, filename, filetype\n " +
            "from tbl_attach where bno = #{bno}")
    List<AttachFile> findAllByBno(Long bno);

    @Delete("delete from tbl_attach where bno = #{bno}")
    Integer deleteAllByBno(Long bno);

    @Select("select *\n" +
            "from tbl_attach\n" + 
            "where uploadPath = date_format(date_sub(now() , interval 1 day), '%Y/%m/%d')")
    List<AttachFile> getOldfilesFromYesterday();
}
