package com.pknu26.phonebook.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pknu26.phonebook.entity.Contact;

public interface ContactRepository extends JpaRepository<Contact, Long> {
 
    @Query("""
        SELECT c FROM Contact c LEFT JOIN FETCH c.group g
        WHERE c.user.id = :userId
          AND (LOWER(c.name)  LIKE LOWER(CONCAT('%', :kw, '%'))
            OR c.phone         LIKE CONCAT('%', :kw, '%')
            OR LOWER(c.email)  LIKE LOWER(CONCAT('%', :kw, '%')))
        ORDER BY c.favorite DESC, c.name ASC
    """)
    List<Contact> search(@Param("kw") String keyword, @Param("userId") Long userId);

    @Query("""
        SELECT c FROM Contact c LEFT JOIN FETCH c.group g
        WHERE c.user.id = :userId AND g.id = :groupId
        ORDER BY c.favorite DESC, c.name ASC
    """)
    List<Contact> findByGroupId(@Param("groupId") Long groupId, @Param("userId") Long userId);

    @Query("""
        SELECT c FROM Contact c LEFT JOIN FETCH c.group g
        WHERE c.user.id = :userId AND c.favorite = true
        ORDER BY c.name ASC
    """)
    List<Contact> findFavorites(@Param("userId") Long userId);

    @Query("""
        SELECT c FROM Contact c LEFT JOIN FETCH c.group
        WHERE c.user.id = :userId
        ORDER BY c.favorite DESC, c.name ASC
    """)
    List<Contact> findAllSorted(@Param("userId") Long userId);

    Optional<Contact> findByIdAndUserId(Long id, Long userId);
}
