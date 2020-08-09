package com.cognixia.jump.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.cognixia.jump.model.Pin;
import com.cognixia.jump.repository.PinRepository;

@RequestMapping("/api")
@RestController
public class PinController {
	
	@Autowired
	PinRepository service;
	
	@GetMapping("/pins")
	public List<Pin> getAllPins() {
		
		return service.findAll();
		
	}
	
	@PostMapping("/add/pin")
	public Pin addPin(@PathVariable long id) {
		
		Optional<Pin> pinOpt = service.findById(id);
		
		if(pinOpt.isPresent()) {
			return pinOpt.get(); 
		}
		
		return new Pin();
	}
	
	@GetMapping("/pins/{id}")
	public Pin getPin(@PathVariable long id) {
		
		Optional<Pin> pinOpt = service.findById(id);
		
		if(pinOpt.isPresent()) {
			return pinOpt.get(); 
		}
		
		return new Pin();
	}
	
	@GetMapping("pins/categories")
	public List<String> getCategories() {
		
		return service.getCategories();
	}
	
	
	@GetMapping("/pins/category/{category}")
	public List<Pin> findByCategory(@PathVariable String category) {
		
		return service.findByCategory(category);

	}
	
	@PostMapping("/create/pin")
	public void createPin(@RequestBody Pin newPin) {
		
		newPin.setId(-1L);
		
		Pin created = service.save(newPin);
		System.out.println("Created: " + created);
	}

	@PutMapping("/update/pin")
	public String updatePin(@RequestBody Pin updatePin) {
		
		// check if pin exists, then update them
		Optional<Pin> found = service.findById(updatePin.getId());
		
		if(found.isPresent()) {
			service.save(updatePin);
			return "Saved: " + updatePin.toString();
		} else {
			return "Could not update student, the id = " + updatePin.getId()
				+ " doesn't exist";
		}
	}

	@PatchMapping("/update/pin/category")
	public @ResponseBody String updateCategory(@RequestBody Map<String, String> catInfo) {
		
		// will need to parse because will still return a string
		long id = Long.parseLong(catInfo.get("id") );
		String category  = catInfo.get("category");
		
		// will return back Optional
		Optional<Pin> found = service.findById(id);
		
		if(found.isPresent()) {
			
			Pin toUpdate = found.get();
			
			Long old = toUpdate.getId();
			
			toUpdate.setCategory(category);
			
			// save new department to be able to update it
			service.save(toUpdate);
			
			return "Old Category: " + old + "\nNew Category: " 
					+ category;
		} else {
			
			return "Could not update category, Pin with id = " 
					+ id + " doesn't exist";
			
		}
		
	}
	
	@PatchMapping("/update/pin/description")
	public @ResponseBody String updateDescription(@RequestBody Map<String, String> descInfo) {
		
		// will need to parse because will still return a string
		long id = Long.parseLong(descInfo.get("id") );
		String description  = descInfo.get("description");
		
		// will return back Optional
		Optional<Pin> found = service.findById(id);
		
		if(found.isPresent()) {
			
			Pin toUpdate = found.get();
			
			Long old = toUpdate.getId();
			
			toUpdate.setCategory(description);
			
			// save new department to be able to update it
			service.save(toUpdate);
			
			return "Old Description: " + old + "\nNew Category: " 
					+ description;
		} else {
			
			return "Could not update description, Pin with id = " 
					+ id + " doesn't exist";
			
		}
		
	}
	
	@DeleteMapping("/delete/pin/{id}")
	public ResponseEntity<String> deletePin(@PathVariable long id) {
		
		Optional<Pin> found = service.findById(id);
		
		if(found.isPresent()) {
			
			service.deleteById(id);

			return ResponseEntity.status(200).body("Deleted pin with id = "
					+ id);
		} else {
			return ResponseEntity.status(400)
					.header("pin id", id + "")
					.body("Pin with id = " + id + " not found");
		}
		
	}
	
}

