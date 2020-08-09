package com.cognixia.jump.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cognixia.jump.model.BoardPin;

@Repository
public interface BoardPinRepository extends JpaRepository<BoardPin, Long>{

	// one of the methods listed in jpa
	// will retrieve all entities from a table
	List<BoardPin> findAll();
	
}
