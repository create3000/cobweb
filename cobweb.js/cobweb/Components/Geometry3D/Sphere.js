
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGeometryNode, 
          X3DConstants,
          Vector3)
{
"use strict";

	function Sphere (executionContext)
	{
		X3DGeometryNode .call (this, executionContext);

		this .addType (X3DConstants .Sphere);
	}

	Sphere .prototype = $.extend (Object .create (X3DGeometryNode .prototype),
	{
		constructor: Sphere,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "radius",   new Fields .SFFloat (1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",    new Fields .SFBool (true)),
		]),
		getTypeName: function ()
		{
			return "Sphere";
		},
		getComponentName: function ()
		{
			return "Geometry3D";
		},
		getContainerField: function ()
		{
			return "geometry";
		},
		set_live__: function ()
		{
			X3DGeometryNode .prototype .set_live__ .call (this);
		   
			if (this .getExecutionContext () .isLive () .getValue () && this .isLive () .getValue ())
				this .getBrowser () .getSphereOptions () .addInterest (this, "eventsProcessed");
			else
				this .getBrowser () .getSphereOptions () .removeInterest (this, "eventsProcessed");
		},
		build: function ()
		{
			var
				options  = this .getBrowser () .getSphereOptions (),
				geometry = options .getGeometry (),
				radius   = this .radius_ .getValue ();

			this .setNormals   (geometry .getNormals ());
			this .setTexCoords (geometry .getTexCoords ());

			if (radius === 1)
			{
				this .setVertices (geometry .getVertices ());
	
				this .getMin () .assign (geometry .getMin ());
				this .getMax () .assign (geometry .getMax ());
			}
			else
			{
				var
					defaultVertices = geometry .getVertices (),
					vertices        = this .getVertices ();

				for (var i = 0; i < defaultVertices .length; i += 4)
				{
					vertices .push (radius * defaultVertices [i],
					                radius * defaultVertices [i + 1],
					                radius * defaultVertices [i + 2],
					                1);
				}

				this .getMin () .set (-radius, -radius, -radius);
				this .getMax () .set ( radius,  radius,  radius);
			}

			this .setSolid (this .solid_ .getValue ());
			this .setCurrentTexCoord (null);
		},
	});

	return Sphere;
});


