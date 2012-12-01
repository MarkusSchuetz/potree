/**
 * potree.js 
 * http://potree.org
 *
 * Copyright 2012, Markus Schütz
 * Licensed under the GPL Version 2 or later.
 * - http://potree.org/wp/?page_id=7
 * - http://www.gnu.org/licenses/gpl-3.0.html
 *
 */

var PointCloudIlluminationMode = {
		FLAT 	: {value:0, name: "Flat"},
		PHONG	: {value:1, name: "Phong"},
		NORMALS	: {value:2, name: "Normals"}
}

var PointCloudRenderMode = {
		FIXED_CIRCLE 	: {value:0, name: "fixed circle"},
		WEIGHTED_CIRCLE	: {value:1, name: "weighted circle"},
		GAUSSIAN_SPLAT 	: {value:2, name: "gaussian splat"},
		FILL_HOLES 		: {value:3, name: "fill holes"},
}

/**
 * Eierlegende wollmilchsau.
 * combines different materials.
 * 
 * @param name
 * @class
 * @augments Material
 * @author Markus Schütz
 */
function PointCloudMaterial(name){
	Material.call(this, name);
	
	this.illuminationMode = PointCloudIlluminationMode.FLAT;
	this.renderMode = PointCloudRenderMode.WEIGHTED_CIRCLE;
	
	this.phongMaterial = new PhongMaterial();
	this.gaussMaterial = null;
	this.weightedMaterial = new WeightedPointSizeMaterial();
	this.fixedMaterial = new FixedPointSizeMaterial();
	this.normalsMaterial = new NormalsMaterial();
	this.fillHoleMaterial = null;
	
	this.activeMaterial = this.weightedMaterial;
}

PointCloudMaterial.prototype = new Material(inheriting);

PointCloudMaterial.prototype.render = function(mno, mnoSceneNode, camera){
	
	if(Potree.isLowQualityMode && this.activeMaterial != this.phongMaterial){
		this.weightedMaterial.render(mno, mnoSceneNode, camera);
	}else{
		this.activeMaterial.render(mno, mnoSceneNode, camera);
	}
};

PointCloudMaterial.prototype.getGaussMaterial = function(){
	if(this.gaussMaterial == null){
		this.gaussMaterial = new GaussSplatMaterial();
	}
	
	return this.gaussMaterial;
}

PointCloudMaterial.prototype.getFillHoleMaterial = function(){
	if(this.fillHoleMaterial == null){
		this.fillHoleMaterial = new FillHoleMaterial();
	}
	
	return this.fillHoleMaterial;
}

/**
 * @param illuminationMode type: PointCloudIlluminationMode
 */
PointCloudMaterial.prototype.setIlluminationMode = function(illuminationMode){
	this.illuminationMode = illuminationMode;
	
	this.updateActiveMaterial();
}

/**
 * @param renderMode type: PointCloudRenderMode
 */
PointCloudMaterial.prototype.setRenderMode = function(renderMode){
	this.renderMode = renderMode;
	
	this.updateActiveMaterial();
	
//	if(this.renderMode == PointCloudRenderMode.FIXED_CIRCLE){
//		this.activeMaterial = this.fixedMaterial;
//	}else if(this.renderMode == PointCloudRenderMode.WEIGHTED_CIRCLE){
//		this.activeMaterial = this.weightedMaterial;
//	}else if(this.renderMode == PointCloudRenderMode.GAUSSIAN_SPLAT){
//		this.activeMaterial = this.gaussMaterial;
//	}
}

PointCloudMaterial.prototype.updateActiveMaterial = function(){
	if(this.illuminationMode == PointCloudIlluminationMode.FLAT){
		if(this.renderMode == PointCloudRenderMode.FIXED_CIRCLE){
			this.activeMaterial = this.fixedMaterial;
		}else if(this.renderMode == PointCloudRenderMode.WEIGHTED_CIRCLE){
			this.activeMaterial = this.weightedMaterial;
		}else if(this.renderMode == PointCloudRenderMode.GAUSSIAN_SPLAT){
			this.activeMaterial = this.getGaussMaterial();
		}
	}else if(this.illuminationMode == PointCloudIlluminationMode.PHONG){
		if(this.renderMode == PointCloudRenderMode.GAUSSIAN_SPLAT){
			this.activeMaterial = this.getGaussMaterial();
		}else{
			this.activeMaterial = this.phongMaterial;
		}
	}else if(this.illuminationMode == PointCloudIlluminationMode.NORMALS){
		this.activeMaterial = this.normalsMaterial;
	}
	
	if(this.renderMode == PointCloudRenderMode.FILL_HOLES){
		this.activeMaterial = this.getFillHoleMaterial();
	}
}

PointCloudMaterial.prototype.setSigmaFactor = function(sigmaFactor){
	this.gaussMaterial.sigmaFactor = sigmaFactor;
}

PointCloudMaterial.prototype.setPointSize = function(pointSize){
	if(this.gaussMaterial != null){
		this.getGaussMaterial().pointSize = pointSize;
	}
	this.weightedMaterial.pointSize = pointSize;
	this.phongMaterial.pointSize = pointSize;
	this.fixedMaterial.pointSize = pointSize;
	this.normalsMaterial.pointSize = pointSize;
	
	if(this.fillHoleMaterial != null){
		this.getFillHoleMaterial().pointSize = pointSize;
	}
}

PointCloudMaterial.prototype.setBlendDepth = function(blendDepth){
	this.gaussMaterial.blendDepth = blendDepth;
}

PointCloudMaterial.prototype.setGlossiness = function(glossiness){
	this.phongMaterial.glossiness = glossiness;
}
