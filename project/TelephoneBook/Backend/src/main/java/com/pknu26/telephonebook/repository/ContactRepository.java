package com.pknu26.telephonebook.repository;

import com.pknu26.telephonebook.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    @Query("""
        SELECT c FROM Contact c LEFT JOIN FETCH c.group g
        WHERE LOWER(c.name)  LIKE LOWER(CONCAT('%', :kw, '%'))
           OR c.phone         LIKE CONCAT('%', :kw, '%')
           OR LOWER(c.email)  LIKE LOWER(CONCAT('%', :kw, '%'))
        ORDER BY c.favorite DESC, c.name ASC
    """)
    List<Contact> search(@Param("kw") String keyword);

    @Query("""
        SELECT c FROM Contact c LEFT JOIN FETCH c.group g
        WHERE g.id = :groupId
        ORDER BY c.favorite DESC, c.name ASC
    """)
    List<Contact> findByGroupId(@Param("groupId") Long groupId);

    @Query("""
        SELECT c FROM Contact c LEFT JOIN FETCH c.group g
        WHERE c.favorite = true
        ORDER BY c.name ASC
    """)
    List<Contact> findFavorites();

    @Query("SELECT c FROM Contact c LEFT JOIN FETCH c.group ORDER BY c.favorite DESC, c.name ASC")
    List<Contact> findAllSorted();
}