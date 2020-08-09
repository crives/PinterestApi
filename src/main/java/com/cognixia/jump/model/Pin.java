package com.cognixia.jump.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.SecondaryTable;

@Entity
//@SecondaryTable(name= "boardpins", pkJoinColumns= @PrimaryKeyJoinColumn(name = "pin_id"))
public class Pin implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@Column(name = "title")
	private String title;
	
	@Column(name = "imagePath")
	private String imagePath;
	
	@Column(columnDefinition = "varchar(100) default 'Unknown'")
	private String category;
	
	@Column(name="description")
	private String description;
	
	// Default Constructor
	public Pin() {
		this(-1L, "N/A", "N/A", "N/A", "N/A");
	}

	public Pin(Long id, String title, String imagePath, String category, String description) {
		super();
		this.id = id;
		this.title = title;
		this.imagePath = imagePath;
		this.category = category;
		this.description = description;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getImagePath() {
		return imagePath;
	}

	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Override
	public String toString() {
		return "Pin [id=" + id + ", title=" + title + ", imagePath=" + imagePath + ", category=" + category
				+ ", description=" + description + "]";
	}

}


