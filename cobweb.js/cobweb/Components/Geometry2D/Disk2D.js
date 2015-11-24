
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

	function Disk2D (executionContext)
	{
		X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .Disk2D);

		this .lineGeometry = false;
	}

	Disk2D .prototype = $.extend (Object .create (X3DGeometryNode .prototype),
	{
		constructor: Disk2D,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",    new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "innerRadius", new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "outerRadius", new Fields .SFFloat (1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",       new Fields .SFBool (true)),
		]),
		getTypeName: function ()
		{
			return "Disk2D";
		},
		getComponentName: function ()
		{
			return "Geometry2D";
		},
		getContainerField: function ()
		{
			return "geometry";
		},
		set_live__: function ()
		{
			X3DGeometryNode .prototype .set_live__ .call (this);

			if (this .getExecutionContext () .isLive () .getValue () && this .isLive () .getValue ())
				this .getBrowser () .getDisk2DOptions () .addInterest (this, "eventsProcessed");
			else
				this .getBrowser () .getDisk2DOptions () .removeInterest (this, "eventsProcessed");
		},
		isLineGeometry: function ()
		{
			return this .lineGeometry;
		},
		build: function ()
		{
			var
				gl          = this .getBrowser () .getContext (),
				options     = this .getBrowser () .getDisk2DOptions (),
				innerRadius = this .innerRadius_ .getValue (),
				outerRadius = this .outerRadius_ .getValue ();

			if (innerRadius === outerRadius)
			{
				// Circle

				var radius = Math .abs (outerRadius);
	
				var
					vertices1 = options .getCircleVertices (),
					vertices2 = this .getVertices ();

				if (radius === 1)
				{
					for (var i = 0, length = vertices1 .length; i < length; i += 4)
						vertices2 .push (vertices1 [i], vertices1 [i + 1], 0, 1);

					this .setExtents  (options .getExtents ());
				}
				else
				{
					for (var i = 0, length = vertices1 .length; i < length; i += 4)
						vertices2 .push (vertices1 [i] * radius, vertices1 [i + 1] * radius, 0, 1);
		
					this .getMin () .set (-radius, -radius, 0);
					this .getMax () .set ( radius,  radius, 0);
				}

				this .lineGeometry = true;
				return;
			}

			if (innerRadius === 0 || outerRadius === 0)
			{
				// Disk

				var
					radius    = Math .abs (Math .max (innerRadius, outerRadius)),
					normals   = this .getNormals (),
					vertices1 = options .getDiskVertices (),
					vertices2 = this .getVertices ();

				this .getTexCoords () .push (options .getDiskTexCoords ());

				for (var i = 0, length = options .getDiskNormals (); i < length; ++ i)
					normals .push (0, 0, 1);
	
				if (radius === 1)
				{
					for (var i = 0, length = vertices1 .length; i < length; i += 4)
						vertices2 .push (vertices1 [i], vertices1 [i + 1], 0, 1);

					this .setExtents  (options .getExtents ());
				}
				else
				{
					for (var i = 0, length = vertices1 .length; i < length; i += 4)
						vertices2 .push (vertices1 [i] * radius, vertices1 [i + 1] * radius, 0, 1);

					this .getMin () .set (-radius, -radius, 0);
					this .getMax () .set ( radius,  radius, 0);
				}
		
				this .setSolid (this .solid_ .getValue ());
				this .setCurrentTexCoord (null);

				this .lineGeometry = false;
				return;
			}

			var
				maxRadius  = Math .abs (Math .max (innerRadius, outerRadius)),
				minRadius  = Math .abs (Math .min (innerRadius, outerRadius)),
				scale      = minRadius / maxRadius,
				offset     = (1 - scale) / 2,
				texCoords1 = options .getDiskTexCoords (),
				texCoords2 = [ ],
				normals    = this .getNormals (),
				vertices1  = options .getDiskVertices (),
				vertices2  = this .getVertices ();

			this .getTexCoords () .push (texCoords2);

			for (var i = 0, length = vertices1 .length; i < length; i += 12)
			{
				texCoords2 .push (texCoords1 [i + 4] * scale + offset, texCoords1 [i + 5] * scale + offset, 0, 1,
				                  texCoords1 [i + 4], texCoords1 [i + 5], 0, 1,
				                  texCoords1 [i + 8], texCoords1 [i + 9], 0, 1,

				                  texCoords1 [i + 4] * scale + offset, texCoords1 [i + 5] * scale + offset, 0, 1,
				                  texCoords1 [i + 8], texCoords1 [i + 9], 0, 1,
				                  texCoords1 [i + 8] * scale + offset, texCoords1 [i + 9] * scale + offset, 0, 1);

				normals .push (0, 0, 1,  0, 0, 1,  0, 0, 1,
                           0, 0, 1,  0, 0, 1,  0, 0, 1);

				vertices2 .push (vertices1 [i + 4] * minRadius, vertices1 [i + 5] * minRadius, 0, 1,
				                 vertices1 [i + 4] * maxRadius, vertices1 [i + 5] * maxRadius, 0, 1,
				                 vertices1 [i + 8] * maxRadius, vertices1 [i + 9] * maxRadius, 0, 1,

				                 vertices1 [i + 4] * minRadius, vertices1 [i + 5] * minRadius, 0, 1,
				                 vertices1 [i + 8] * maxRadius, vertices1 [i + 9] * maxRadius, 0, 1,
				                 vertices1 [i + 8] * minRadius, vertices1 [i + 9] * minRadius, 0, 1);
			}

			this .getMin () .set (-maxRadius, -maxRadius, 0);
			this .getMax () .set ( maxRadius,  maxRadius, 0);
	
			this .setSolid (this .solid_ .getValue ());
			this .setCurrentTexCoord (null);

			this .lineGeometry = false;
		},
		traverse: function (context)
		{
			if (this .isLineGeometry ())
			{
				var
					browser = this .getBrowser (),
					shader  = browser .getShader ();
	
				if (shader === browser .getDefaultShader ())
				{
					browser .setTexture (null);
					browser .setShader (shader = browser .getLineShader ());
				}
	
				var primitiveMode = shader .primitiveMode;
	
				shader .primitiveMode = browser .getContext () .LINE_LOOP;
	
				X3DGeometryNode .prototype .traverse .call (this, context);
	
				shader .primitiveMode = primitiveMode;
			}
			else
			{
				context .geometryType = 2;
	
				X3DGeometryNode .prototype .traverse .call (this, context);
	
				context .geometryType = 3;
			}
		},
	});

	return Disk2D;
});


