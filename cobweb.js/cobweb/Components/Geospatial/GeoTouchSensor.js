
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/PointingDeviceSensor/X3DTouchSensorNode",
	"cobweb/Components/Geospatial/X3DGeospatialObject",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Matrix4",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTouchSensorNode, 
          X3DGeospatialObject, 
          X3DConstants,
          Vector3,
          Matrix4)
{
"use strict";

	var
		invModelViewMatrix = new Matrix4 (),
		geoCoords          = new Vector3 (0, 0, 0);

	function GeoTouchSensor (executionContext)
	{
		X3DTouchSensorNode  .call (this, executionContext);
		X3DGeospatialObject .call (this, executionContext);

		this .addType (X3DConstants .GeoTouchSensor);
	}

	GeoTouchSensor .prototype = $.extend (Object .create (X3DTouchSensorNode .prototype),
		X3DGeospatialObject .prototype,
	{
		constructor: GeoTouchSensor,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",            new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "geoOrigin",           new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "geoSystem",           new Fields .MFString ("GD", "WE")),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "enabled",             new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "description",         new Fields .SFString ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "hitTexCoord_changed", new Fields .SFVec2f ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "hitNormal_changed",   new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "hitPoint_changed",    new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "hitGeoCoord_changed", new Fields .SFVec3d ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isOver",              new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",            new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "touchTime",           new Fields .SFTime ()),
		]),
		getTypeName: function ()
		{
			return "GeoTouchSensor";
		},
		getComponentName: function ()
		{
			return "Geospatial";
		},
		getContainerField: function ()
		{
			return "children";
		},
		initialize: function ()
		{
			X3DTouchSensorNode  .prototype .initialize .call (this);
			X3DGeospatialObject .prototype .initialize .call (this);
		},
		set_over__: function (hit, value)
		{
			try
			{
				X3DTouchSensorNode .prototype .set_over__ .call (this, hit, value);

				if (this .isOver_ .getValue ())
				{
					var
						intersection    = hit .intersection,
						modelViewMatrix = this .getMatrices () [hit .layer .getId ()] .modelViewMatrix;

					invModelViewMatrix .assign (modelViewMatrix) .inverse ();

					this .hitTexCoord_changed_ = intersection .texCoord;
					this .hitNormal_changed_   = modelViewMatrix .multMatrixDir (intersection .normal .copy ()) .normalize ();
					this .hitPoint_changed_    = invModelViewMatrix .multVecMatrix (intersection .point .copy ());
					this .hitGeoCoord_changed_ = this .getGeoCoord (this .hitPoint_changed_ .getValue (), geoCoords);
				}
			}
			catch (error)
			{
				console .log (error);
			}
		},
	});

	return GeoTouchSensor;
});


