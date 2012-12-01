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


var PointAttributeNames = 
{
	POSITION_CARTESIAN 	: 0,	// float x, y, z;
	COLOR_PACKED		: 1,	// byte r, g, b, a; 	I = [0,1]
	COLOR_FLOATS_1		: 2,	// float r, g, b; 		I = [0,1]
	COLOR_FLOATS_255	: 3,	// float r, g, b; 		I = [0,255]
	NORMAL_FLOATS		: 4,  	// float x, y, z;
};

var i = 0;
for(obj in PointAttributeNames){
	PointAttributeNames[i] = PointAttributeNames[obj];
	i++;
}

var PointAttributeTypes =
{
	DATA_TYPE_DOUBLE	: {ordinal : 0, size: 8},
	DATA_TYPE_FLOAT		: {ordinal : 1, size: 4},
	DATA_TYPE_INT8		: {ordinal : 2, size: 1},
	DATA_TYPE_UINT8		: {ordinal : 3, size: 1},
	DATA_TYPE_INT16		: {ordinal : 4, size: 2},
	DATA_TYPE_UINT16	: {ordinal : 5, size: 2},
	DATA_TYPE_INT32		: {ordinal : 6, size: 4},
	DATA_TYPE_UINT32	: {ordinal : 7, size: 4},
	DATA_TYPE_INT64		: {ordinal : 8, size: 8},
	DATA_TYPE_UINT64	: {ordinal : 9, size: 8}
};

var i = 0;
for(obj in PointAttributeTypes){
	PointAttributeTypes[i] = PointAttributeTypes[obj];
	i++;
}

/**
 * 
 * @param name 
 * @param type
 * @param size
 * @returns
 */
function PointAttribute(name, type, numElements){
	this.name = name;
	this.type = type; 
	this.numElements = numElements;
}

function PointAttributes(){
	
}

PointAttributes.POSITION_CARTESIAN = new PointAttribute(
		PointAttributeNames.POSITION_CARTESIAN,
		PointAttributeTypes.DATA_TYPE_FLOAT, 3);

PointAttributes.COLOR_PACKED = new PointAttribute(
		PointAttributeNames.COLOR_PACKED,
		PointAttributeTypes.DATA_TYPE_INT8, 4);

PointAttributes.COLOR_FLOATS_1 = new PointAttribute(
		PointAttributeNames.COLOR_FLOATS_1,
		PointAttributeTypes.DATA_TYPE_FLOAT, 3);

PointAttributes.COLOR_FLOATS_255 = new PointAttribute(
		PointAttributeNames.COLOR_FLOATS_255,
		PointAttributeTypes.DATA_TYPE_FLOAT, 3);

PointAttributes.NORMAL_FLOATS = new PointAttribute(
		PointAttributeNames.NORMAL_FLOATS,
		PointAttributeTypes.DATA_TYPE_FLOAT, 3);


