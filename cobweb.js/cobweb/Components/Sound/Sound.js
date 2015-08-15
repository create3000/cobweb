
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Sound/X3DSoundNode",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector2",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Numbers/Rotation4",
	"standard/Math/Numbers/Matrix4",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DSoundNode, 
          X3DCast,
          TraverseType,
          X3DConstants,
          Vector2,
          Vector3,
          Rotation4,
          Matrix4)
{
	with (Fields)
	{
		function Sound (executionContext)
		{
			X3DSoundNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Sound);

			this .min = { radius: 0, distance: 0 };
			this .max = { radius: 0, distance: 0 };
		}

		Sound .prototype = $.extend (Object .create (X3DSoundNode .prototype),
		{
			constructor: Sound,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",   new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "intensity",  new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "spatialize", new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "location",   new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "direction",  new SFVec3f (0, 0, 1)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "minBack",    new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "minFront",   new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "maxBack",    new SFFloat (10)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "maxFront",   new SFFloat (10)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "priority",   new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "source",     new SFNode ()),
			]),
			transformationMatrix: new Matrix4 (),
			translation: new Vector3 (0, 0, 0),
			rotation: new Rotation4 (),
			scale: new Vector3 (1, 1, 1),
			viewer: new Vector3 (0, 0, 0),
			zAxis: new Vector3 (0, 0, 1),
			getTypeName: function ()
			{
				return "Sound";
			},
			getComponentName: function ()
			{
				return "Sound";
			},
			getContainerField: function ()
			{
				return "children";
			},
			initialize: function ()
			{
				X3DSoundNode .prototype .initialize .call (this);

				this .source_ .addInterest (this, "set_source__");

				this .set_source__ ();
			},
			set_source__: function ()
			{
				this .sourceNode = X3DCast (X3DConstants .X3DSoundSourceNode, this .source_);
			},
			traverse: function (type)
			{
				if (type !== TraverseType .DISPLAY)
					return;

				if (! this .sourceNode)
					return;

				if (! this .sourceNode .isActive_ .getValue () || this .sourceNode .isPaused_ .getValue ())
					return;

				try
				{
					this .getEllipsoidParameter (this .maxBack_ .getValue (), this .maxFront_ .getValue (), this .max);
					this .getEllipsoidParameter (this .minBack_ .getValue (), this .minFront_ .getValue (), this .min);

					if (this .max .distance < this .max .radius)
					{
						if (this .min .distance < this .min .radius)
							this .sourceNode .setVolume (this .intensity_ .getValue ());

						else
						{
							var
								d1 = this .max .radius - this .max .distance,
								d2 = this .max .radius - this .min .radius;

							this .sourceNode .setVolume (this .intensity_ .getValue () * (d1 / d2));
						}
					}
					else
						this .sourceNode .setVolume (0);
				}
				catch (error)
				{
				   console .log (error);
				}
			},
			getEllipsoidParameter: function (back, front, value)
			{
				/*
				 * http://de.wikipedia.org/wiki/Ellipse
				 *
				 * The ellipsoid is transformed to a sphere for easier calculation and then the viewer position is
				 * transformed into this coordinate system. The radius and distance can then be obtained.
				 */

				var
					a = (back + front) / 2,
					e = a - back,
					b = Math .sqrt (a * a - e * e);
				
				this .translation .z = e;
				this .rotation .setFromTo (this .zAxis, this .direction_ .getValue ());
				this .scale .z = b / a;

				var transformationMatrix = this .transformationMatrix;

				transformationMatrix .assign (this .getBrowser () .getModelViewMatrix () .get ());
				transformationMatrix .translate (this .location_ .getValue ());
				transformationMatrix .rotate (this .rotation);

				transformationMatrix .translate (this .translation);
				transformationMatrix .scale (this .scale);

				transformationMatrix .inverse ();

				this .viewer .set (transformationMatrix [12],
				                   transformationMatrix [13],
				                   transformationMatrix [14]);

				value .radius   = b;
				value .distance = this .viewer .abs ();
			},
		});

		return Sound;
	}
});

