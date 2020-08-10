package com.cognixia.jump.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.cognixia.jump.model.Pin;

@Repository
public interface PinRepository extends JpaRepository<Pin, Long> {

	// one of the methods listed in jpa
	// will retrieve all entities from a table
	List<Pin> findAll();
	
	List<Pin> findByCategory(String category);
	
	@Query(value ="SELECT DISTINCT category FROM pin", nativeQuery= true)
	List<String> getCategories();
	
	@Query(value = "SELECT * FROM spring_db.pin WHERE category = 'France'", nativeQuery = true)
	List<Pin> pinsFromFrance();
	
	@Query(value = "SELECT * FROM spring_db.pin WHERE category = 'Pets'", nativeQuery = true)
	List<Pin> petsPins();
}
